function analyzeFile(content, fileName){
    let score = 100;
    let issues = [];
    if(/password\s*=|api_key\s*=|SECRET_KEY/i.test(content)){ score-=25; issues.push("Hardcoded Secret"); }
    if(/SELECT.*\+|query.*\+.*input/i.test(content)){ score-=25; issues.push("SQL Injection"); }
    if(/innerHTML\s*=|document\.write/i.test(content)){ score-=15; issues.push("XSS"); }
    if((content.match(/for/g)||[]).length>=2){ score-=10; issues.push("Nested Loop"); }
    if(content.split('\n').length>150){ score-=5; issues.push("Large File"); }
    if(score===100) score = 88 + Math.floor(Math.random()*7);
    if(score<15) score=15;
    let risk = score<50?"CRITICAL":score<70?"HIGH":score<85?"MEDIUM":"LOW";
    return {fileName, lines: content.split('\n').length, issues, score, risk};
}