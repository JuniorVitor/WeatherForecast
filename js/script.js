'use strict';



//const url = "https://api.weatherbit.io/v2.0/forecast/daily?city=Jundiai&key=ca4e5776f4db4b1b97ed9c318c3b3bab";
const baseURL = "https://api.weatherbit.io/v2.0/forecast/daily";
const apiKey = 'ca4e5776f4db4b1b97ed9c318c3b3bab';
const weekDays = {
    0: 'Dom',
    1: 'Seg',
    2: 'Ter',
    3: 'Qua',
    4: 'Qui',
    5: 'Sex',
    6: 'Sáb'
};

var newCity = 'Jundiaí';
getForecast(newCity);

$('#search').click(function(event){
    event.preventDefault();
    newCity = $('#city').val();
    getForecast(newCity);
    $('#city').val('');
    $('#city').focus();
});

$('#checkTipo').change(function(){
    console.log(newCity)
    getForecast(newCity);
})

function getForecast(city){
    $('#loader').css('display','');
    $('#forecast').css('display','none');
    clearFields();

    $.ajax({
        url: baseURL,
        data: {
            key: apiKey,
            city: city,
            lang: 'pt'
        },
        success: (result)=>{
            $('#loader').css('display','none');
            $('#forecast').css('display','');
            $('#city-name').text(result.city_name);

            const forecast = result.data;
            const today = forecast[0];
            const type = getType();
            $('#tempLetra').text(`${type==='K' ? '': '°'}${type}`);

            displayToday(today, type);
            const nextDays = forecast.slice(1);
            displayNextDays(nextDays, type);
        },
        error: (e)=>{
            console.log(error.responseText);
        }
    });
}

function getType(){
    for(let i=0; i<3; i++){
        let elem = $('input:radio:eq('+i+')');
        if(elem.prop("checked")){
            return elem.val();
        }
    }
}
function clearFields(){
    $('#next-days').empty();
}

function convertTemp(temp, type){
   return type === 'C' ? temp : (
        type === 'F' ? (temp*1.8)+32 : (
            type === 'K' ? temp+273 : (
                temp
            )));
}

function displayToday(today, type){
    

    const temperature = Math.round(convertTemp(today.temp,type));
    const windSpeed = today.wind_spd;
    const humidity = today.rh;
    const weather = today.weather.description;
    const icon = today.weather.icon;
    const iconURL = `https://www.weatherbit.io/static/img/icons/${icon}.png`;
    console.log(iconURL);

    $('#current-temperature').text(temperature);
    $('#current-weather').text(weather);
    $('#current-wind').text(windSpeed);
    $('#current-humidity').text(humidity);
    $('#weather-icon').attr('src', iconURL);
    console.log(today);
}

function displayNextDays(nextDays, type){
    const day = nextDays;
    day.forEach((v, i, a) => {
        const min = Math.round(convertTemp(a[i].min_temp, type));
        const max = Math.round(convertTemp(a[i].max_temp,type));
        const date = new Date(a[i].valid_date);
        const weekday = weekDays[date.getUTCDay()];
        const card = $(`
                <div class="day-card">
                    <div class="date">${date.getUTCDate()}/${date.getUTCMonth()+1}</div>
                    <div class="weekday">${weekday}</div>
                    <div class="temperatures">
                        <span class="max">${max}°</span>
                        <span class="min">${min}°</span>
                    </div>
                </div>
            `);
            card.appendTo('#next-days');
    });
}