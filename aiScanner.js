const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


async function scanCodeWithAI(
    codeName,
    language,
    code
) {

    const prompt = `
You are an expert software code reviewer.

Analyze the following source code.

Code Name:
${codeName}

Programming Language:
${language}

Source Code:
----------------
${code}
----------------

Analyze:

1. Syntax problems
2. Logical problems
3. Bugs
4. Security problems
5. Code quality
6. Maintainability
7. Performance problems
8. Best-practice violations

Give a realistic quality/working score from 0 to 100.

IMPORTANT:
The score is an AI code-quality estimate.
Do not claim that the code definitely works unless it has actually
been executed or tested.

Return ONLY valid JSON using this structure:

{
    "workingPercentage": 0,
    "status": "Good",
    "summary": "Short explanation",
    "errors": [],
    "securityIssues": [],
    "suggestions": [],
    "strengths": [],
    "testsRecommended": []
}
`;


    const response = await client.responses.create({

        model: "gpt-5.6-luna",

        input: prompt

    });


    const text =
        response.output_text;


    let result;


    try {

        result = JSON.parse(text);

    }

    catch (error) {

        console.error(
            "AI returned invalid JSON:",
            text
        );

        throw new Error(
            "AI returned invalid response"
        );

    }


    // Make sure percentage stays between 0 and 100

    result.workingPercentage =
        Math.max(
            0,
            Math.min(
                100,
                Number(result.workingPercentage) || 0
            )
        );


    if (result.workingPercentage >= 80) {

        result.status = "Good";

    }

    else if (result.workingPercentage >= 60) {

        result.status =
            "Needs Improvement";

    }

    else {

        result.status = "Poor";

    }


    return {

        codeName,

        language,

        ...result

    };

}


module.exports = {
    scanCodeWithAI
};
