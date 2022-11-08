import gendap from "../src/lib/gendap";

test("generated image is type buffer", async () => {
	type TestUser = { displayAvatarURL: () => string };
	const testuser = {
		displayAvatarURL: () =>
			"https://github.com/willuhm-js/dapper/blob/master/src/images/test.jpg?raw=true",
	};
	expect(await gendap(testuser, testuser)).toBeInstanceOf(Buffer);
}, 20000);
