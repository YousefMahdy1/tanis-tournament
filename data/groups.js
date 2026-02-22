const GROUPS = ["A","B","C","D","E","F","G","H"];

let tournament =
JSON.parse(localStorage.getItem("tournament")) || {
    groups:{},
    matches:[]
};

GROUPS.forEach(g=>{
    if(!tournament.groups[g]){
        tournament.groups[g]=[];
    }
});