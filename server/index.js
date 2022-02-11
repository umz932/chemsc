const express = require("express"), a = express(),
      cheerio = require("cheerio"),
      { get, head } = require("axios"),
      base64url = require("base64-url"),
      regulator = require("express-slow-down")({
        windowMs: 1000,
        delayAfter: 2,
        delayMs: 500,
      }),
      pc_prefix = "https://pubchem.ncbi.nlm.nih.gov/rest";

/**
 * scrape webpage
 * @param {String} url URL to scrape
 * @param {Object} params GET parameter
 * @return {jQuery} jQuery objects of scraped html 
 */
async function scrape(url, params) {
    let res = await get(url, { params, headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:96.0) Gecko/20100101 Firefox/96.0" } });
    return cheerio.load(res.data);
}
/** process PubChem API responses
 * 
 */
async function __process(type, params) {
        const p = `${pc_prefix}/pug/compound/${type}`;
        const d = await Promise.all( [`${p}/property/IUPACName,MolecularFormula,MolecularWeight,CanonicalSMILES/json`,
                                      `${p}/synonyms/json`,
                                      `${p}/description/json`]
                  .map(v => get(v, { params }).catch(err => Promise.resolve({err}))));
        // if cid is unavailable
        if( 'err' in d[0] ) return [ d[0].err.response.status, d[0].err.response.data ];
        let props = d[0].data.PropertyTable.Properties[0], 
            cas = !d[1].err ? d[1].data.InformationList.Information[0].Synonym.find(t=>/^\d+-\d{2}-\d$/.test(t)) || null : null,
            name = !d[2].err ? d[2].data.InformationList.Information[0].Title || null : null;
        // if returned cid is 0: Structure is not found on SMILES search.
        if( !props.CID ) return [ 404, { Fault: { Message: "Not found" }} ];
        // head msds to check if it's available
        let is_msds_avail = cas ? await head(`http://anzeninfo.mhlw.go.jp/anzen/gmsds/${cas}.html`).then(z=>true).catch(z=>false) : false;
        return [200, {
            cid: props.CID,
            formula: props.MolecularFormula,
            mw: props.MolecularWeight,
            iupac: props.IUPACName || null,
            smiles: props.CanonicalSMILES,
            cas,
            name,
            is_msds_avail,
        }];
}

a.use(require("helmet")());
a.use(require("compression")());


/*a.get("/beacon", (q,s) => {
    s.send("line is alive");
});*/

a.get("/smiles/:smiles", regulator, (q, s) => {
    __process("smiles",{ smiles: base64url.decode(q.params.smiles) }).then(r => s.status(r[0]).json(r[1]) );
});
a.get("/name/:name", regulator, (q,s) => {
    __process("name",{ name: q.params.name }).then(r => s.status(r[0]).json(r[1]) );
});
a.get("/png/:cid", regulator, (q,s) => {
    let cid = parseInt(q.params.cid), res;
    if( Number.isNaN(cid) || cid <= 0 ) return s.status(400).send("Bad request");
    (async()=>{
        if( !(res = await get(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/png`, { responseType: 'arraybuffer' }).catch(()=>null)) ) return s.status(404).send("CID Not Found");
        s.send(`data:${res.headers['content-type']};base64,${Buffer.from(res.data,"binary").toString("base64")}`);
    })();
});

a.get("/search/:query?", regulator, (q,s) => {
    if( !q.params.query ) return s.json([]);
    (async()=>{
        let res = (await get(pc_prefix + "/autocomplete/compound/" + q.params.query + "/json")).data;
        s.json( res.dictionary_terms.compound || [] );
    })().catch(()=>{
        s.json([]);
    });
});

/**
 * Get chemical properties from TCI catalog
 */
a.get("/props/:cas", regulator, async (q,s) => {
    const prop_list = [   
        ["density", "比重"],
        ["mp", "融点"],
        ["bp", "沸点"],
        ["state", "物理的状態"],
        ["sdbs", "SDBS"],
        ["store_at", "保管温度"],
        ["unstable_under", "避けるべき条件"]
    ];


    // verify CAS
    if( !/^\d+-\d\d-\d$/.test(q.params.cas) ) return s.status(400).json({ Fault: { Message: "Given CAS No. is not valid." } });
    // return value container
    let res = {},
    // get product id corresponding to given CAS.
        pid = await scrape("https://www.tcichemicals.com/JP/ja/search/", { text: q.params.cas })
                    .then($ => $(`.prductlist[data-casno='${q.params.cas}']`).attr("data-id") || "");
    
    //
    if(!pid) return s.status(404).json({ Fault: { Message: "The product is unavailable or TCI site is down. Check availability and try again." } });
    // Get properties
    let $ = await scrape("https://www.tcichemicals.com/JP/ja/p/" + pid);
    for(let i of prop_list) 
        res[ i[0] ] = $(".productDetailTable").find(`td:contains(${ i[1] })`).eq(0).next().text();

    s.json(res);
});

module.exports = {
    path: "/_/",
    handler: a
}