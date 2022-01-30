export const state = () => ({
    smiles: ""
});

export const mutations = {
    update($, q) {
        $.smiles = q;
    },
    clear($) {
        $.smiles = "";
    }
}
