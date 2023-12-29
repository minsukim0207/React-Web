const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
const oracledb = requrie("oracledb");
const dbconfig = {
    user: "KHCAFE",
    password: "KHCAFE",
    connectString: "localhost:1521/XE";
};

let connection;

app.post("/api/saveWeatherData", async(req, res) => {
    const {city_name, temp, rh, description} = req.body;
    console.log("데이터확인: ", {city_name, temp, rh, description});

    try {
        connection = await oracledb.getConnection(dbconfig);
        const result = await connection.execute(
            `INSERT INTO WEATHER_DATA (CITY_NAME, TEMP, RH, DESCRIPTION VALUES (:city_name, :temp, :rh, :description))`
            {city_name, temp, rh, description},
            {autoCommit: true}
        );
        console.log("날씨 저장", result);
    } catch (error) {
        console.error("날씨를 저장하는 도중 오류가 발생", error);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error("데이터베이스 닫을 수 없음", error);
            }
        }
    }
});

app.listen(PORT, () => {
    console.log(`서버포트 ${PORT} 실행중`);
})