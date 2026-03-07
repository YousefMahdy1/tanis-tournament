function sortGroup(group) {
    if (!tournament.groups[group]) return;

    tournament.groups[group].sort((a, b) => {
        // 1. الترتيب بالنقاط أولاً
        const pointsA = a.points || 0;
        const pointsB = b.points || 0;
        if (pointsB !== pointsA) return pointsB - pointsA;

        // 2. كسر التعادل بالمواجهات المباشرة (Head-to-Head)
        // نجلب سجل المباريات بالكامل من localStorage لضمان أحدث البيانات
        const allMatches = JSON.parse(localStorage.getItem("matches")) || [];
        
        // البحث عن مباراة جمعت الفريقين المتساويين في نفس المجموعة
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

            // إذا كان هناك فائز في المواجهة المباشرة، يتصدر الفائز
            if (scoreA !== scoreB) {
                return scoreB - scoreA; 
            }
        }

        // 3. فارق الأهداف العام (في حال تعادل المواجهات المباشرة)
        const diffA = (a.gf || 0) - (a.ga || 0);
        const diffB = (b.gf || 0) - (b.ga || 0);
        if (diffB !== diffA) return diffB - diffA;

        // 4. الأهداف المسجلة (له)
        return (b.gf || 0) - (a.gf || 0);
    });
}