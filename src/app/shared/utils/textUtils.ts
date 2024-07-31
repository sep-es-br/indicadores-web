export function orderArrayText(data:any, key:string) {
	return data.sort((a:any, b:any) => {
		if (a[key].toLowerCase() < b[key].toLowerCase()) {
			return -1;
		}
		if (a[key].toLowerCase() > b[key].toLowerCase()) {
			return 1;
		}
		return 0;
	});
}