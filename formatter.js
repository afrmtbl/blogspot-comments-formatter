const fs = require("fs")

function parse_comment(text_array) {
	const texts = [];
	for (text_object of text_array) {
		texts.push(parse_text_object(text_object));
	}
	return texts;
}

function parse_text_object(obj) {
	const object_types = ["text", "line_break", "link", "mention", "topic"];
	const object_styles = [null, "bold"];

	const text_object = {};

	text_object["type"] = object_types[obj[0]];

	if (text_object["type"] == "text") {
		text_object["text"] = obj[1];
		if (obj.length === 3) {
			text_object["styling"] = object_styles[obj[2][0]];
		}
	}
	else if (text_object["type"] == "link") {
		text_object["text"] = obj[1];
		text_object["url"] = obj[3][0];
	}
	else if (text_object["type"] == "mention") {
		text_object["user_name"] = obj[1];
		text_object["user_id"] = obj[4][1];
	}
	else if (text_object["type"] == "topic") {
		text_object["text"] = obj[1];
		text_object["url"] = obj[3][0];
		text_object["topic_name"] = obj[5][0];
	}

	return text_object;
}

function comment_to_html(comment_texts) {
	let html_string = "";
	for (text of comment_texts) {
		
		if (text.type === "line_break") {
			const final_string = "<br>";
			html_string += final_string

		}
		else if (text.type === "text") {
			let final_string = text.text;
			if (text.styling) {
				if (text.styling === "bold") {
					final_string = `<b>${final_string}</b>`
				}
			}
			html_string += final_string
		}
		else if (text.type === "link") {
			const final_string = `<a href=\"${text.url}\">${text.text}</a>`;
			html_string += final_string;
		}
		else if (text.type === "mention") {
			const final_string = `<a href=\"https://plus.google.com/${text.user_id}\">+${text.user_name}</a>`
			html_string += final_string;
		}
		else if (text.type === "topic") {
			const final_string = `<a href=\"${text.url}\">${text.text}</a>`;
			html_string += final_string;

		}
	}

	return html_string
}

const file = fs.readFileSync("sample_comment.json", "utf-8")

comment = JSON.parse(file)
const parsed = parse_comment(comment["text"][0])

console.log(parsed)

console.log(comment_to_html(parsed))