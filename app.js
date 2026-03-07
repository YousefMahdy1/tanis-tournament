/* ================= إضافة فريق ================= */
function addTeam(){
    const group = document.getElementById("groupSelect").value;
    const name = document.getElementById("teamName").value.trim();

    if(!name) return alert("اكتب اسم الفريق");

    const team = {
        name: name,
        played: 0,
        win: 0,
        draw: 0,
        lose: 0,
        gf: 0,
        ga: 0,
        points: 0
    };

    tournament.groups[group].push(team);
    saveTournament();
    renderTable(group);
    
    if(document.getElementById("matchGroup").value === group) {
        updateMatchTeamsList(group);
    }

    document.getElementById("teamName").value = "";
}

/* ================= تحديث قوائم الفرق بناءً على المجموعة المختارة ================= */
function updateMatchTeamsList(group) {
    const t1Select = document.getElementById("team1Select");
    const t2Select = document.getElementById("team2Select");

    t1Select.innerHTML = '<option value="" disabled selected>الفريق الأول</option>';
    t2Select.innerHTML = '<option value="" disabled selected>الفريق الثاني</option>';

    if (!group || !tournament.groups[group]) return;

    const teams = tournament.groups[group];

    teams.forEach(team => {
        t1Select.add(new Option(team.name, team.name));
        t2Select.add(new Option(team.name, team.name));
    });
}

/* ================= تسجيل نتيجة مباراة (محدث للانتقال للهدافين) ================= */
/* استبدل دالة addMatch في ملف app.js بهذا الكود */
function addMatch() {
    const group = document.getElementById("matchGroup").value;
    const t1Name = document.getElementById("team1Select").value;
    const t2Name = document.getElementById("team2Select").value;
    const g1 = parseInt(document.getElementById("goals1").value);
    const g2 = parseInt(document.getElementById("goals2").value);

    if (!group) return alert("اختر المجموعة أولاً");
    if (!t1Name || !t2Name || isNaN(g1) || isNaN(g2)) return alert("أكمل بيانات النتيجة والفرق");

    // 1. معالجة النقاط في الجدول (الدالة الموجودة مسبقاً)
    processMatch(group, t1Name, g1, t2Name, g2);
    
    // 2. حفظ المباراة في سجل المباريات العام للـ Dashboard
    let allMatches = JSON.parse(localStorage.getItem("matches")) || [];
    allMatches.push({
        home: t1Name,
        away: t2Name,
        homeGoals: g1,
        awayGoals: g2,
        group: group,
        date: new Date().toLocaleString()
    });
    localStorage.setItem("matches", JSON.stringify(allMatches));

    // 3. حفظ آخر فريقين لصفحة الهدافين
    localStorage.setItem("lastMatchTeams", JSON.stringify([t1Name, t2Name]));

    saveTournament();
    renderTable(group);

    alert(`تم تسجيل المباراة! جاري الانتقال لتسجيل الهدافين...`);
    window.location.href = "scorers.html";
}
/* ================= معالجة وترتيب البيانات ================= */
function processMatch(group, team1Name, goals1, team2Name, goals2) {
    const teams = tournament.groups[group];
    const team1 = teams.find(t => t.name === team1Name);
    const team2 = teams.find(t => t.name === team2Name);

    if (!team1 || !team2) return;

    team1.gf += goals1; team1.ga += goals2;
    team2.gf += goals2; team2.ga += goals1;
    team1.played += 1; team2.played += 1;

    if (goals1 > goals2) {
        team1.win += 1; team1.points += 3; team2.lose += 1;
    } else if (goals1 < goals2) {
        team2.win += 1; team2.points += 3; team1.lose += 1;
    } else {
        team1.draw += 1; team2.draw += 1;
        team1.points += 1; team2.points += 1;
    }
}



/* ================= رسم الجدول والتحميل ================= */
function renderTable(group) {
    const body = document.getElementById("tableBody");
    if(!body) return;
    body.innerHTML = "";

    const teams = tournament.groups[group] || [];
    sortGroup(group);

    const groupTitle = document.getElementById("groupTitle");
    if(groupTitle) groupTitle.innerText = "ترتيب المجموعة " + group;

    teams.forEach((t, index) => {
        const tr = document.createElement("tr");
        if(index === 0) tr.classList.add("first");
        let star = (index === 0 || index === 1) ? '⭐ ' : '';
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td style="text-align:right;">${star}${t.name}</td>
            <td>${t.played}</td>
            <td>${t.win}</td>
            <td>${t.draw}</td>
            <td>${t.lose}</td>
            <td>${t.gf}</td>
            <td>${t.ga}</td>
            <td style="font-weight:bold; color:#ffd700;">${t.points}</td>
        `;
        body.appendChild(tr);
    });
}

function downloadTableAsImage() {
    const element = document.getElementById("tableToCapture");
    const groupName = document.getElementById("currentGroupView").value;
    html2canvas(element, { backgroundColor: "#111", scale: 2 }).then(canvas => {
        const link = document.createElement("a");
        link.download = `ترتيب_المجموعة_${groupName}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}

/* ================= الحفظ والحذف ================= */
function updateDeleteTeamsList(group) {
    const teamSelect = document.getElementById("deleteTeamSelect");
    teamSelect.innerHTML = '<option value="" disabled selected>اختر الفريق</option>';
    const teams = tournament.groups[group] || [];
    teams.forEach((team, index) => {
        teamSelect.add(new Option(team.name, index));
    });
}

function confirmDeleteTeam() {
    const group = document.getElementById("deleteGroupSelect").value;
    const teamIndex = document.getElementById("deleteTeamSelect").value;
    if (!group || teamIndex === "") return alert("اختر المجموعة والفريق");
    if (confirm("حذف الفريق نهائياً؟")) {
        tournament.groups[group].splice(teamIndex, 1);
        saveTournament();
        renderTable(group);
        updateDeleteTeamsList(group);
    }
}
/* ================= تعديل اسم الفريق ================= */

// تحديث قائمة الفرق عند اختيار المجموعة في خانة التعديل
function updateEditTeamsList(group) {
    const teamSelect = document.getElementById("editTeamSelect");
    teamSelect.innerHTML = '<option value="" disabled selected>اختر الفريق</option>';
    const teams = tournament.groups[group] || [];
    teams.forEach((team) => {
        teamSelect.add(new Option(team.name, team.name));
    });
}

function renameTeam() {
    const group = document.getElementById("editGroupSelect").value;
    const oldName = document.getElementById("editTeamSelect").value;
    const newName = document.getElementById("newTeamName").value.trim();

    if (!group || !oldName || !newName) return alert("أكمل البيانات أولاً");
    if (oldName === newName) return alert("الاسم الجديد مطابق للاسم القديم!");

    // 1. تحديث الاسم في مصفوفة المجموعات
    const team = tournament.groups[group].find(t => t.name === oldName);
    if (team) {
        team.name = newName;
    }

    // 2. تحديث الاسم في سجل المباريات (ضروري جداً للمواجهات المباشرة)
    let allMatches = JSON.parse(localStorage.getItem("matches")) || [];
    allMatches.forEach(m => {
        if (m.group === group) {
            if (m.home === oldName) m.home = newName;
            if (m.away === oldName) m.away = newName;
        }
    });
    localStorage.setItem("matches", JSON.stringify(allMatches));

    // 3. الحفظ وتحديث الجدول
    saveTournament();
    renderTable(group);
    
    // تنظيف الخانات
    document.getElementById("newTeamName").value = "";
    updateEditTeamsList(group);
    
    // تحديث أسماء الفرق في قائمة الهدافين أيضاً
    let scorers = JSON.parse(localStorage.getItem("scorers")) || [];
    scorers.forEach(s => {
        if (s.team === oldName) s.team = newName;
    });
    localStorage.setItem("scorers", JSON.stringify(scorers));
    alert(`تم تغيير الاسم من [${oldName}] إلى [${newName}] بنجاح ✅`);
}

function saveTournament(){
    localStorage.setItem("tournament", JSON.stringify(tournament));
}

window.onload = function() {
    renderTable("A");
};