function addMatch() {
    // 1. جلب القيم من العناصر (تأكد أن الـ IDs تطابق الموجود في index.html)
    const group = document.getElementById("matchGroup").value;
    const teamA_Name = document.getElementById("team1").value;
    const teamB_Name = document.getElementById("team2").value;
    const goalsA_input = document.getElementById("goals1");
    const goalsB_input = document.getElementById("goals2");

    const goalsA = parseInt(goalsA_input.value);
    const goalsB = parseInt(goalsB_input.value);

    // 2. التحقق من صحة البيانات المدخلة
    if (!teamA_Name || !teamB_Name || isNaN(goalsA) || isNaN(goalsB)) {
        alert("يرجى كتابة أسماء الفرق وإدخال عدد الأهداف");
        return;
    }

    // 3. البحث عن الفرق في المجموعة المختارة
    const teams = tournament.groups[group];
    const A = teams.find(t => t.name.trim() === teamA_Name.trim());
    const B = teams.find(t => t.name.trim() === teamB_Name.trim());

    if (!A || !B) {
        alert("خطأ: لم يتم العثور على اسم الفريق. تأكد من كتابة الاسم تماماً كما هو موجود في الجدول.");
        return;
    }

    // 4. طلب أسماء الهدافين (الربط مع صفحة الهدافين)
    // سيظهر نافذة (Prompt) لكل هدف مسجل
    if (goalsA > 0) recordScorersInGroups(teamA_Name, goalsA);
    if (goalsB > 0) recordScorersInGroups(teamB_Name, goalsB);

    // 5. تحديث إحصائيات الفرق في جدول الترتيب
    A.played++; B.played++;
    A.gf += goalsA; A.ga += goalsB;
    B.gf += goalsB; B.ga += goalsA;

    if (goalsA > goalsB) {
        A.win++; B.lose++; A.points += 3;
    } else if (goalsB > goalsA) {
        B.win++; A.lose++; B.points += 3;
    } else {
        A.draw++; B.draw++; A.points++; B.points++;
    }

    // 6. الحفظ والتحديث
    saveTournament(); // الدالة الموجودة في app.js
    renderTable(group); // تحديث عرض الجدول
    
    // إضافة المباراة لسجل الإحصائيات (لـ Dashboard)
    let allMatches = JSON.parse(localStorage.getItem("matches")) || [];
    allMatches.push({ home: teamA_Name, away: teamB_Name, homeGoals: goalsA, awayGoals: goalsB });
    localStorage.setItem("matches", JSON.stringify(allMatches));

    // 7. مسح الخانات بعد الإدخال بنجاح
    goalsA_input.value = "";
    goalsB_input.value = "";
    
    alert("تم تسجيل النتيجة وتحديث قائمة الهدافين بنجاح ✅");
}

// دالة طلب أسماء الهدافين وتخزينهم في localStorage
function recordScorersInGroups(teamName, goalsCount) {
    for (let i = 1; i <= goalsCount; i++) {
        let playerName = prompt(`من سجل الهدف رقم (${i}) لفريق [ ${teamName} ]؟`);
        if (playerName && playerName.trim() !== "") {
            // استدعاء دالة addGoal من ملف script.js
            if (typeof addGoal === "function") {
                addGoal(playerName, teamName);
            }
        }
    }
}