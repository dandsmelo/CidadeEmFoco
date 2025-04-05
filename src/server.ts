import cors from "cors";
import app from "./api/routes/routes";
import morgan from "morgan";
import { connectDb } from "./config/db";

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan("dev"));

connectDb();

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
