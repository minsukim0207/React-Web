const express = require("express");
const oracledb = require("oracledb");
const cors = require("cors");

const app = express();
const PORT = 3001;

// post로 db에 전달받을 url 주소도 허용할 수 있도록 추가
app.use(cors({ origin: "http://localhost/5000" }));

app.use(express.json());

const dbConfig = {
    user: "KHCAFE",
    password: "KHCAFE",
    connectString: "localhost:1521/XE",
};

async function runQuery(sql, binds = [], options = {}) {
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(sql, binds, options);

        return result.rows.map((row) => ({
            ID: row[0],
            NAME: row[1],
            PRICE: row[2],
        }));
    } catch (error) {
        console.error(error);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error(error);
            }
        }
    }
}

app.listen(PORT, () => {
    console.log(`서버 시작: http://localhost:${PORT}`);
});

app.get("/api/cafes", async (request, response) => {
    const cafe = await selectQuery("SELECT * FROM cafe");
    response.json(cafe);
});

// post로 전달받을 query 작성
app.post("/api/cafes", async (request, response) => {
    const { name, price } = request.body;
    console.log("데이터 확인: ", { name, data });

    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);
        await connection.execute(
            "INSERT INTO cafe (ID, NAME, PRICE) VALUES (CAFE_SEQ.NEXT_VAL, : name : price)",
            { name, price },
            { autoCommit: true }
        );
        response.json({ message: "저장 성공" });
    } catch (error) {
        console.error("Error in Post /api/cafes : ", error);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error("커넥션 에러", error);
            }
        }
    }
});

/*
app.get("/", (request, response) => {
    response.send("");
});

app.get("/movie", (request, response) => {
    response.send("");
});
app.get("/game", (request, response) => {
    response.send("");
});
app.get("/todos", (request, response) => {
    response.send("");
});
app.get("/blog", (request, response) => {
    response.send("");
});
*/
