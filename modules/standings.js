function sortGroup(group) {
    const allMatches = JSON.parse(localStorage.getItem("matches")) || [];
    
    tournament.groups[group].sort((a, b) => {
        // 1. الترتيب بالنقاط
        if ((b.points || 0) !== (a.points || 0)) {
            return (b.points || 0) - (a.points || 0);
        }

        // 2. كسر التعادل بالمواجهات المباشرة (فقط مباريات المجموعات)
        const h2hMatch = allMatches.find(m => 
            m.type === "group" && // تجاهل مباريات الشجرة
            ((m.home === a.name && m.away === b.name) || (m.home === b.name && m.away === a.name))
        );

        if (h2hMatch) {
            let aScore = (h2hMatch.home === a.name) ? h2hMatch.homeGoals : h2hMatch.awayGoals;
            let bScore = (h2hMatch.home === b.name) ? h2hMatch.homeGoals : h2hMatch.awayGoals;
            if (aScore !== bScore) return bScore - aScore;
        }

        // 3. فارق الأهداف العام
        const diffA = (a.gf || 0) - (a.ga || 0);
        const diffB = (b.gf || 0) - (b.ga || 0);
        if (diffB !== diffA) return diffB - diffA;

        // 4. الأهداف المسجلة
        return (b.gf || 0) - (a.gf || 0);
    });
}