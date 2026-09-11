import re
def scan_file(content, filename):
    issues, score = [], 100
    if re.search(r"password\s*=|api_key", content, re.I):
        issues.append({"type":"Hardcoded Secret"}); score-=25
    if re.search(r"SELECT.*\+", content, re.I):
        issues.append({"type":"SQL Injection"}); score-=25
    if re.search(r"innerHTML", content):
        issues.append({"type":"XSS"}); score-=15
    if not issues: score=88
    return max(score,10), issues