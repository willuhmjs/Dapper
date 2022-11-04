import gendap from "../src/lib/gendap";

test("generated image is type buffer", async () => {
	type TestUser = { displayAvatarURL: () => string }
	const testuser = { displayAvatarURL: () => "https://media.discordapp.net/attachments/1028766392989794444/1029202069812424764/dapper.png?width=406&height=406" }
	expect(await gendap(testuser, testuser)).toBeInstanceOf(Buffer)
}, 20000);