function sortGroup(group) {
    tournament.groups[group].sort((a, b) => {
        // 1. الترتيب بالنقاط أولاً
        const pointsA = a.points || 0;
        const pointsB = b.points || 0;
        if (pointsB !== pointsA) return pointsB - pointsA;

        // 2. كسر التعادل بالمواجهات المباشرة (Head-to-Head)
        // نجلب سجل المباريات بالكامل من localStorage
        let allMatches = JSON.parse(localStorage.getItem("matches")) || [];
        
        // البحث عن مباراة جمعت الفريقين (أ و ب) في نفس المجموعة
        const h2hMatch = allMatches.find(m => 
            m.group === group && 
            ((m.home === a.name && m.away === b.name) || 
             (m.home === b.name && m.away === a.name))
        );

        if (h2hMatch) {
            let scoreA, scoreB;
            if (h2hMatch.home === a.name) {
                scoreA = h2hMatch.homeGoals;
                scoreB = h2hMatch.awayGoals;
            } else {
                scoreA = h2hMatch.awayGoals;
                scoreB = h2hMatch.homeGoals;
            }

            // إذا كان هناك فائز في المواجهة المباشرة
            if (scoreA !== scoreB) {
                return scoreB - scoreA; // الفائز يوضع في الترتيب الأعلى
            }
        }

        // 3. فارق الأهداف (في حال تعادل المواجهات المباشرة أو لم يلعبوا ضد بعض بعد)
        const diffA = (a.gf || 0) - (a.ga || 0);
        const diffB = (b.gf || 0) - (b.ga || 0);
        if (diffB !== diffA) return diffB - diffA;

        // 4. الأهداف المسجلة (له)
        return (b.gf || 0) - (a.gf || 0);
    });
}