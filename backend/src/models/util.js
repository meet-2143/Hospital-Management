const config = require('./../config');

module.exports.generateNumber = function (length) {
  return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
}

module.exports.findDistance = function(latlng) {
	if ((latlng.lat1 == latlng.lat2) && (latlng.lon1 == latlng.lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * latlng.lat1/180;
		var radlat2 = Math.PI * latlng.lat2/180;
		var theta = latlng.lon1 - latlng.lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

module.exports.similarCities = function(city) {
	var allCities = config.similarCities;
	var resultCities;
	allCities.forEach(function(ct, i){
		var tempCities = ct.split(",");
		tempCities.forEach(function(tmpCt){
			city.forEach(function(orgCt){
				if(tmpCt.toLowerCase() == orgCt.toLowerCase()){
					resultCities = allCities[i];
				}
			})
		});
	});
	console.log(city);
	if(typeof(resultCities) !== "undefined"){
		var tempCities = resultCities.split(",");
		tempCities.forEach(function(ct){
			if(city.indexOf(ct) == -1){
				city.push(ct)
			}
		})
	}
	return city;
}

module.exports.getJobStatusText = function(params){
	var text = [];
	if(params.jobStatus == "Yes"){
		text.push("Actively looking");
		if(params.jobStatusOption == "1"){
			text.push("Join immediately")
		}
		if(params.jobStatusOption == "2"){
			text.push("Serving notice period")
			text.push(params.jobStatusNoticePeriod);
		}
		if(params.jobStatusOption == "3"){
			text.push("Not resigned yet")
			text.push(params.jobStatusNoticePeriod);
		}
	}
	if(params.jobStatus == "No"){
		text.push("Not looking anymore");
	}
	return text.join(", ")
}

module.exports.convertTime = function(timezone, data){
	return data;
	if(typeof(timezone) == "undefined"){
		timezone = config.timezoneOffSet["IN"];
	}
	if(data != undefined){
		if(data.length == undefined){
			for (var key in data) {
				if(key == "createdAt" || key == "updatedAt" || key == "publishedDate" || key == "jobDateExpired" || key == "dateExpired" || key == "jobPublished" || key == "interviewAt" || key == "expiredAt" || key == "lastLogin" || key == "employeeBlockedAt" || key == "date_time"){
					var dt = new Date(data[key]);
					dt.setMinutes(dt.getMinutes() + parseInt(timezone));
					data[key] = dt.getTime();
				}
			}
		} else {
			data.forEach((element, i) => {
				for (var key in element) {
					if(key == "createdAt" || key == "updatedAt" || key == "publishedDate" || key == "jobDateExpired" || key == "dateExpired" || key == "jobPublished" || key == "interviewAt" || key == "expiredAt" || key == "lastLogin" || key == "employeeBlockedAt" || key == "date_time"){
						var dt = new Date(data[i][key]);
						dt.setMinutes(dt.getMinutes() + parseInt(timezone));
						data[i][key] = dt.getTime();
					}
				}
			});
		}
	}
	return data;
}