function sortGroup(group){

    tournament.groups[group].sort((a,b)=>{

        // النقاط
        if(b.points !== a.points)
            return b.points - a.points;

        // فارق الأهداف
        const diffA = a.gf - a.ga;
        const diffB = b.gf - b.ga;

        if(diffB !== diffA)
            return diffB - diffA;

        // الأهداف المسجلة
        return b.gf - a.gf;
    });
}