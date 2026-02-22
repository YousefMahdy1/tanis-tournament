/* ================= إضافة فريق ================= */

function addTeam(){

    const group = document.getElementById("groupSelect").value;
    const name = document.getElementById("teamName").value;

    if(!name) return alert("اكتب اسم الفريق");

    const team = {
        name:name,
        played:0,
        win:0,
        draw:0,
        lose:0,
        gf:0,
        ga:0,
        points:0
    };

    tournament.groups[group].push(team);

    saveTournament();
    renderTable(group);

    document.getElementById("teamName").value="";
}


/* ================= رسم الجدول ================= */

/* ================= رسم الجدول المطور بالنجمة ================= */

function renderTable(group) {
    const body = document.getElementById("tableBody");
    body.innerHTML = "";

    const teams = tournament.groups[group];
    sortGroup(group);

    // تحديث عنوان المجموعة داخل منطقة التصوير
    const groupTitle = document.getElementById("groupTitle");
    if(groupTitle) groupTitle.innerText = "ترتيب المجموعة " + group;

    teams.forEach((t, index) => {
        const tr = document.createElement("tr");
        if(index === 0) tr.classList.add("first");

        let star = (index === 0 || index === 1) ? '<span class="qualify-star">⭐</span> ' : '';

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${star}${t.name}</td>
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

// تحديث قائمة الفرق في قائمة الحذف عند اختيار مجموعة
function updateDeleteTeamsList(group) {
    const teamSelect = document.getElementById("deleteTeamSelect");
    teamSelect.innerHTML = '<option value="" disabled selected>اختر الفريق للحذف</option>';
    
    const teams = tournament.groups[group] || [];
    
    teams.forEach((team, index) => {
        const option = document.createElement("option");
        option.value = index; // نستخدم الترتيب (index) لسهولة الحذف
        option.textContent = team.name;
        teamSelect.appendChild(option);
    });
}

// تنفيذ عملية الحذف
function confirmDeleteTeam() {
    const group = document.getElementById("deleteGroupSelect").value;
    const teamIndex = document.getElementById("deleteTeamSelect").value;

    if (group === "" || teamIndex === "") {
        return alert("يرجى اختيار المجموعة والفريق أولاً");
    }

    const teamName = tournament.groups[group][teamIndex].name;

    if (confirm(`هل أنت متأكد من حذف فريق (${teamName}) نهائياً؟`)) {
        // حذف من المصفوفة
        tournament.groups[group].splice(teamIndex, 1);
        
        // حفظ وتحديث
        saveTournament();
        renderTable(group); // تحديث الجدول المعروض
        updateDeleteTeamsList(group); // تحديث قائمة الحذف نفسها
        
        alert("تم حذف الفريق بنجاح");
    }
}

function downloadTableAsImage() {
    const element = document.getElementById("tableToCapture");
    
    // التحقق من وجود العنصر
    if (!element) {
        alert("خطأ: لم يتم العثور على جدول لتصويره!");
        return;
    }

    const groupName = document.getElementById("currentGroupView")?.value || "A";

    // تفعيل وضع التحميل
    console.log("جاري تجهيز الصورة...");

    html2canvas(element, {
        backgroundColor: "#111",
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true // سيظهر أي خطأ في الـ Console (F12)
    }).then(canvas => {
        try {
            const link = document.createElement("a");
            link.download = `ترتيب_المجموعة_${groupName}.png`;
            link.href = canvas.toDataURL("image/png");
            document.body.appendChild(link); // إضافة مؤقتة للمتصفحات الصارمة
            link.click();
            document.body.removeChild(link);
            console.log("تم التحميل بنجاح!");
        } catch (err) {
            console.error("خطأ في إنشاء رابط التحميل:", err);
            alert("حدث خطأ أثناء حفظ الصورة");
        }
    }).catch(err => {
        console.error("خطأ في مكتبة html2canvas:", err);
        alert("المكتبة لم تكتمل بعد، يرجى المحاولة مرة أخرى أو فحص اتصال الإنترنت");
    });
}
/* ================= حفظ ================= */

function saveTournament(){
    localStorage.setItem(
        "tournament",
        JSON.stringify(tournament)
    );
}


/* عرض المجموعة A عند فتح الصفحة */
renderTable("A");