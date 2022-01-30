
export default [
	// [ "Supplier Name", (cas) => `Supplier's CAS searching URI`, is-allow-iframe ]
    ["TCI", (cas) => `https://www.tcichemicals.com/JP/ja/search/?text=${cas}`, 1],
    ["Sigma-Aldrich", (cas) => `https://www.sigmaaldrich.com/catalog/search?interface=CAS%20No.&term=${cas}&N=0&lang=ja&region=JP&focus=product&mode=mode+matchall`, 1],
    ["Wako", (cas) => `https://labchem-wako.fujifilm.com/jp/product/result/product.html?fw=${cas}`, 0],
    ["KANTO", (cas) => `https://cica-catalog.kanto.co.jp/organics/search?cas=${cas}`, 1],
    ["Nacalai tesque", (cas) => `https://www.nacalai.co.jp/ss/ec/EC-srchlist.cfm?srchword=&like1=2&scode=&like2=1&MCode1=&MName1=&cce1=c1&ccet=${cas}&Kensu=20`, 1],

]
