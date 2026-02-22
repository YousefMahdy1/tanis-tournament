// ======= الهدافين =======
function addGoal(playerName, teamName) {
    // جلب البيانات من الذاكرة المحلية
    let scorersList = JSON.parse(localStorage.getItem("scorers")) || [];
    
    // البحث عن اللاعب (بشرط تطابق الاسم والفريق)
    let player = scorersList.find(p => p.name === playerName && p.team === teamName);
    
    if (player) {
        player.goals++;
    } else {
        scorersList.push({ name: playerName, team: teamName, goals: 1 });
    }
    
    // حفظ البيانات المحدثة
    localStorage.setItem("scorers", JSON.stringify(scorersList));
}

// ======= إحصائيات اللاعبين (MVP) =======
function updatePlayer(name, team, goals = 0, motm = false, win = false) {
    let playersStats = JSON.parse(localStorage.getItem("playersStats")) || [];
    let player = playersStats.find(p => p.name === name);
    
    if (!player) {
        player = { name, team, points: 0 };
        playersStats.push(player);
    }
    
    player.points += (goals * 3);
    if (motm) player.points += 5;
    if (win) player.points += 2;
    
    localStorage.setItem("playersStats", JSON.stringify(playersStats));
}

// ======= لوحة البيانات (Dashboard) =======
function updateDashboard() {
    let matches = JSON.parse(localStorage.getItem("matches")) || [];
    let scorersList = JSON.parse(localStorage.getItem("scorers")) || [];
    
    // جلب بيانات البطولة لحساب عدد الفرق بدقة
    let tournamentData = JSON.parse(localStorage.getItem("tournament")) || { groups: {} };
    let totalTeams = 0;
    for (let g in tournamentData.groups) {
        totalTeams += tournamentData.groups[g].length;
    }

    // حساب إجمالي الأهداف مع التأكد من أن القيم أرقام
    let totalGoals = matches.reduce((sum, m) => {
        return sum + (Number(m.homeGoals) || 0) + (Number(m.awayGoals) || 0);
    }, 0);

    // تحديث العناصر في HTML إذا كانت موجودة
    const matchesEl = document.getElementById("matches");
    const goalsEl = document.getElementById("goals");
    const teamsEl = document.getElementById("teams");
    const topScorerEl = document.getElementById("topScorer");

    if (matchesEl) matchesEl.innerText = "عدد المباريات: " + matches.length;
    if (goalsEl) goalsEl.innerText = "إجمالي الأهداف: " + totalGoals;
    if (teamsEl) teamsEl.innerText = "عدد الفرق: " + totalTeams;

    // ترتيب الهدافين لجلب الأول
    if (scorersList.length > 0) {
        let top = [...scorersList].sort((a, b) => b.goals - a.goals)[0];
        if (topScorerEl) topScorerEl.innerText = "الهداف: " + top.name;
    } else {
        if (topScorerEl) topScorerEl.innerText = "الهداف: -";
    }
}