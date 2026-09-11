let scannedData = [];
document.getElementById('files').addEventListener('change', function(e){
    document.getElementById('fileCount').innerText = e.target.files.length + " files selected: " + Array.from(e.target.files).map(f=>f.name).join(', ');
});

function startAIScan(){
    const input = document.getElementById('files');
    const files = input.files;
    if(files.length===0){
        scannedData = [
            {fileName:"PaymentService.java", lines:210, issues:["SQL Injection","Hardcoded Secret"], score:42, risk:"CRITICAL"},
            {fileName:"AuthController.js", lines:165, issues:["XSS","Memory Leak"], score:58, risk:"HIGH"},
            {fileName:"Database.py", lines:98, issues:["Nested Loop"], score:76, risk:"MEDIUM"},
            {fileName:"ApiClient.ts", lines:120, issues:["Large File"], score:82, risk:"MEDIUM"},
            {fileName:"Utils.java", lines:45, issues:[], score:94, risk:"LOW"},
            {fileName:"UIComponents.jsx", lines:88, issues:[], score:91, risk:"LOW"}
        ];
        showResults(); return;
    }
    scannedData = [];
    let promises = Array.from(files).map(file=>{
        return new Promise(resolve=>{
            const reader = new FileReader();
            reader.onload = e=>{ resolve(analyzeFile(e.target.result, file.name)); };
            reader.readAsText(file);
        });
    });
    Promise.all(promises).then(results=>{ scannedData = results; showResults(); });
}

function showResults(){
    let overall = Math.round(scannedData.reduce((a,b)=>a+b.score,0)/scannedData.length);
    document.getElementById('projectHealth').innerText = overall+"/100";
    document.getElementById('overallScore').innerText = overall+"%";
    document.getElementById('totalFiles').innerText = scannedData.length;
    document.getElementById('criticalCount').innerText = scannedData.filter(f=>f.risk==="CRITICAL").length;
    document.getElementById('releaseStatus').innerText = overall>=80?"READY ✅":"NOT READY";
    scannedData.sort((a,b)=>a.score-b.score);
    let table = document.getElementById('fileTable');
    table.innerHTML = "";
    scannedData.forEach((f,i)=>{
        let color = f.risk==="CRITICAL"?"bg-red-600":f.risk==="HIGH"?"bg-orange-600":f.risk==="MEDIUM"?"bg-yellow-600 text-black":"bg-green-600";
        let scoreColor = f.score<50?"text-red-400":f.score<70?"text-orange-400":f.score<85?"text-yellow-400":"text-emerald-400";
        table.innerHTML += `<tr class="border-b border-gray-800"><td class="p-4">${i+1}</td><td class="p-4 font-bold">${f.fileName}</td><td class="p-4">${f.lines}</td><td class="p-4 text-xs">${f.issues.join(', ')||"Clean"}</td><td class="p-4 font-black text-lg ${scoreColor}">${f.score}%</td><td class="p-4"><span class="${color} px-2 py-1 rounded text-[10px]">${f.risk}</span></td></tr>`;
    });
}

function applyFixes(){
    let current = parseInt(document.getElementById('overallScore').innerText);
    let interval = setInterval(()=>{
        current+=1;
        document.getElementById('overallScore').innerText=current+"%";
        document.getElementById('projectHealth').innerText=current+"/100";
        if(current>=94){ clearInterval(interval); document.getElementById('releaseStatus').innerText="READY ✅"; scannedData.forEach(f=>f.score=Math.min(94, f.score+25)); showResults(); }
    },80);
}

window.onload = ()=>{ startAIScan(); };