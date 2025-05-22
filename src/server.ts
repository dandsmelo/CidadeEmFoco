import cors from "cors";
import app from "./api/routes/routes";
import morgan from "morgan";
import { connectDb } from "./config/db";

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:8081',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(morgan("dev"));

connectDb();

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
