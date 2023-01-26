const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: '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'
});
const openai = new OpenAIApi(configuration);

async function findCity(txt) {
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-002",
            prompt: `Does the sentence "${txt}" contains a city name around the world`,
            temperature: 0.9,
            max_tokens: 2048,
        });
        // return response
        return response.data.choices[0].text
    } catch (err) {
        return err
    }
}

module.exports = {
    findCity
} 