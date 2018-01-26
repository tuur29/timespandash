// Source: https://github.com/angular/angular-cli/issues/6711#issuecomment-333604658

let finalEnviron:any = { production: true };

function loadJSON(filePath) {
	const json = loadTextFileAjaxSync(filePath, "application/json");
	return JSON.parse(json);
}

function loadTextFileAjaxSync(filePath, mimeType) {
	const xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", filePath, false);
	if (mimeType != null)
		if (xmlhttp.overrideMimeType)
			xmlhttp.overrideMimeType(mimeType);

	xmlhttp.send();
	if (xmlhttp.status == 200)
		return xmlhttp.responseText;
	else
		return null;
}

function loadVars(finalEnviron){
	let environ = loadJSON('config.json');

	for (let key in environ) {
		let item = environ[key];
		finalEnviron[key] = item;
	}
	return finalEnviron;
}

export const environment = loadVars(finalEnviron);