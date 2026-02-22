function getQualified() {
    // جلب بيانات البطولة من الذاكرة
    const tournamentData = JSON.parse(localStorage.getItem("tournament"));
    if (!tournamentData || !tournamentData.groups) return null;

    let qualified = {};
    const GROUPS_LIST = ["A", "B", "C", "D", "E", "F", "G", "H"];

    GROUPS_LIST.forEach(g => {
        let groupTeams = tournamentData.groups[g] || [];
        
        // ترتيب فرق المجموعة (نقاط ثم فارق أهداف)
        groupTeams.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            return (b.gf - b.ga) - (a.gf - a.ga);
        });

        // أخذ الأول والثاني فقط
        qualified[g] = {
            first: groupTeams[0] || null,
            second: groupTeams[1] || null
        };
    });

    return qualified;
}

function createRound16() {
    const q = getQualified();
    if (!q) return [];

    // ترتيب مباريات دور الـ 16 (نظام المقص العالمي)
    return [
        [q.A.first, q.C.second], // مباراة 1
        [q.B.first, q.D.second], // مباراة 2
        [q.E.first, q.G.second], // مباراة 3
        [q.F.first, q.H.second], // مباراة 4
        [q.C.first, q.A.second], // مباراة 5
        [q.D.first, q.B.second], // مباراة 6
        [q.G.first, q.E.second], // مباراة 7
        [q.H.first, q.F.second]  // مباراة 8
    ];
}