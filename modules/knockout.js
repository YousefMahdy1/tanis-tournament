/**
 * المحرك البرمجي للأدوار الإقصائية - مركز شباب تانيس
 */

// 1. جلب الفرق المتأهلة وترتيبها بناءً على نتائج المجموعات
function getQualified() {
    // جلب بيانات البطولة
    const data = JSON.parse(localStorage.getItem("tournament"));
    if (!data || !data.groups) {
        alert("تنبيه: لا توجد بيانات مجموعات مسجلة. يرجى إدخال النتائج في لوحة التحكم أولاً.");
        return null;
    }

    let qualified = {};
    const GROUPS_LIST = ["A", "B", "C", "D", "E", "F", "G", "H"];

    GROUPS_LIST.forEach(g => {
        let groupTeams = data.groups[g] || [];
        
        // ترتيب الفرق مع التحقق من اسم حقل النقاط (points أو pts)
        groupTeams.sort((a, b) => {
            let ptsA = a.points !== undefined ? a.points : (a.pts || 0);
            let ptsB = b.points !== undefined ? b.points : (b.pts || 0);
            
            if (ptsB !== ptsA) return ptsB - ptsA;
            
            // فارق الأهداف
            return (b.gf - b.ga) - (a.gf - a.ga);
        });

        // التأكد من وجود فريقين على الأقل لتجنب الخطأ
        qualified[g] = {
            first: groupTeams[0] || { name: `متصدر ${g}` },
            second: groupTeams[1] || { name: `وصيف ${g}` }
        };
    });

    return qualified;
}

// 2. توزيع مباريات دور الـ 16 بنظام المقص (Bracket) كما في البطولة الكبرى
function createRound16() {
    const q = getQualified();
    if (!q) return [];

    /**
     * توزيع المسارات (نظام المقص العالمي):
     * الجناح الأيمن (Right Side) - المباريات 0-3
     * الجناح الأيسر (Left Side) - المباريات 4-7
     */
    return [
        // الجناح الأيمن (Right Side) كما في الصورة
        [q.A.first, q.C.second], // مباراة 0
        [q.F.first, q.H.second], // مباراة 1
        [q.G.first, q.E.second], // مباراة 2
        [q.D.first, q.B.second], // مباراة 3
        // الجناح الأيسر (Left Side) كما في الصورة
        [q.B.first, q.D.second], // مباراة 4
        [q.C.first, q.A.second], // مباراة 5
        [q.E.first, q.G.second], // مباراة 6
        [q.H.first, q.F.second]  // مباراة 7
    ];
}

// 3. دالة حفظ حالة الشجرة (الأسماء التي صعدت يدوياً)
function saveBracketState() {
    const state = {
        qf: {}, // ربع النهائي
        sf: {}, // نصف النهائي
        final: {}, // النهائي
        champion: document.getElementById("winner-name")?.innerText || "؟"
    };

    // جلب أسماء الفرق من الخانات (IDs) في HTML
    for (let i = 0; i < 4; i++) {
        state.qf[`qf-${i}-s0`] = document.getElementById(`qf-${i}-s0`)?.innerText;
        state.qf[`qf-${i}-s1`] = document.getElementById(`qf-${i}-s1`)?.innerText;
    }

    for (let i = 0; i < 2; i++) {
        state.sf[`sf-${i}-s0`] = document.getElementById(`sf-${i}-s0`)?.innerText;
        state.sf[`sf-${i}-s1`] = document.getElementById(`sf-${i}-s1`)?.innerText;
    }

    state.final['final-s0'] = document.getElementById('final-s0')?.innerText;
    state.final['final-s1'] = document.getElementById('final-s1')?.innerText;

    localStorage.setItem("knockout_state", JSON.stringify(state));
}

// 4. دالة استرجاع حالة الشجرة عند تحديث الصفحة
function loadBracketState() {
    const savedState = JSON.parse(localStorage.getItem("knockout_state"));
    if (!savedState) return;

    // استرجاع ربع النهائي
    if (savedState.qf) {
        for (let id in savedState.qf) {
            const el = document.getElementById(id);
            if (el) el.innerText = savedState.qf[id];
        }
    }

    // استرجاع نصف النهائي
    if (savedState.sf) {
        for (let id in savedState.sf) {
            const el = document.getElementById(id);
            if (el) el.innerText = savedState.sf[id];
        }
    }

    // استرجاع النهائي والبطل
    if (savedState.final) {
        if(document.getElementById("final-s0")) document.getElementById("final-s0").innerText = savedState.final["final-s0"] || "؟";
        if(document.getElementById("final-s1")) document.getElementById("final-s1").innerText = savedState.final["final-s1"] || "؟";
    }
    
    if (savedState.champion && document.getElementById("winner-name")) {
        document.getElementById("winner-name").innerText = savedState.champion;
    }
}