const ChartJSImage = require("chart.js-image");
const moment = require("moment");


const getGoodHistoryStatistic = (histories, good) => {

    //min max dates then divide on 10 points
    const first_entry = histories[0];
    const dates = [moment(good.createdAt).format('YYYY-MM-DD'), ...histories.map(tg => moment(tg.createdAt).format('YYYY-MM-DD'))];
    const prices = [first_entry.old_price_uah.toString(), ...histories.map(tg => tg.new_price_uah.toString())];

    return ChartJSImage().chart({
        "type": "line",
        "data": {
            "labels": dates,
            "datasets": [
                {
                    "label": "Price Line",
                    "borderColor": "rgb(255,+99,+132)",
                    "backgroundColor": "rgba(255,+99,+132,+.5)",
                    "data": prices
                },
            ]
        },
        "options": {
            "title": {
                "display": true,
                "text": "Price Change Line"
            },
            "scales": {
                "xAxes": [
                    {
                        "scaleLabel": {
                            "display": true,
                            "labelString": "Time"
                        }
                    }
                ],
                "yAxes": [
                    {
                        "stacked": true,
                        "scaleLabel": {
                            "display": true,
                            "labelString": "Price"
                        }
                    }
                ]
            }
        }
    }) // Line chart
        .backgroundColor('white')
        .width(500) // 500px
        .height(300); // 300px

}


module.exports = {
    getGoodHistoryStatistic
}
