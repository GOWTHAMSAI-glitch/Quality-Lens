const API_URL =
    "http://localhost:5000/api/ai-scan";


async function scanCode() {

    const codeName =
        document
            .getElementById("codeName")
            .value
            .trim();


    const language =
        document
            .getElementById("language")
            .value;


    const code =
        document
            .getElementById("code")
            .value
            .trim();


    if (!codeName) {

        showError(
            "Please enter a code name."
        );

        return;

    }


    if (!code) {

        showError(
            "Please paste your code."
        );

        return;

    }


    const button =
        document.getElementById(
            "scanButton"
        );


    const loading =
        document.getElementById(
            "loading"
        );


    const result =
        document.getElementById(
            "result"
        );


    const error =
        document.getElementById(
            "error"
        );


    button.disabled = true;

    loading.classList.remove(
        "hidden"
    );

    result.classList.add(
        "hidden"
    );

    error.classList.add(
        "hidden"
    );


    try {

        const response =
            await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    codeName,
                    language,
                    code

                })

            });


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "AI scan failed"
            );

        }


        displayResult(data);

    }

    catch (err) {

        showError(
            err.message
        );

    }

    finally {

        button.disabled = false;

        loading.classList.add(
            "hidden"
        );

    }

}


function displayResult(data) {

    const result =
        document.getElementById(
            "result"
        );


    result.classList.remove(
        "hidden"
    );


    // Score

    const score =
        document.getElementById(
            "score"
        );


    score.textContent =
        `${data.workingPercentage}%`;


    score.className = "score";


    if (
        data.workingPercentage < 80 &&
        data.workingPercentage >= 60
    ) {

        score.classList.add(
            "warning"
        );

    }


    if (
        data.workingPercentage < 60
    ) {

        score.classList.add(
            "bad"
        );

    }


    // Table

    const table =
        document.getElementById(
            "resultTable"
        );


    const statusClass =
        getStatusClass(
            data.workingPercentage
        );


    const icon =
        getStatusIcon(
            data.workingPercentage
        );


    table.innerHTML = `

        <tr>

            <td>
                ${escapeHTML(
                    data.codeName
                )}
            </td>

            <td>
                ${escapeHTML(
                    data.language
                )}
            </td>

            <td class="${statusClass}">
                ${data.workingPercentage}%
            </td>

            <td class="${statusClass}">
                ${icon}
                ${escapeHTML(
                    data.status
                )}
            </td>

        </tr>

    `;


    // Summary

    document.getElementById(
        "summary"
    ).textContent =
        data.summary;


    // Lists

    displayList(
        "errors",
        data.errors
    );


    displayList(
        "securityIssues",
        data.securityIssues
    );


    displayList(
        "suggestions",
        data.suggestions
    );


    displayList(
        "strengths",
        data.strengths
    );


    displayList(
        "testsRecommended",
        data.testsRecommended
    );

}


function displayList(
    elementId,
    items
) {

    const element =
        document.getElementById(
            elementId
        );


    element.innerHTML = "";


    if (
        !items ||
        items.length === 0
    ) {

        const li =
            document.createElement(
                "li"
            );

        li.textContent =
            "No major issues found.";

        element.appendChild(li);

        return;

    }


    items.forEach(item => {

        const li =
            document.createElement(
                "li"
            );

        li.textContent = item;

        element.appendChild(li);

    });

}


function getStatusClass(score) {

    if (score >= 80) {

        return "good";

    }


    if (score >= 60) {

        return "warning";

    }


    return "bad";

}


function getStatusIcon(score) {

    if (score >= 80) {

        return "✅";

    }


    if (score >= 60) {

        return "⚠️";

    }


    return "❌";

}


function showError(message) {

    const error =
        document.getElementById(
            "error"
        );


    error.textContent = message;

    error.classList.remove(
        "hidden"
    );

}


function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent = text;

    return div.innerHTML;

}

