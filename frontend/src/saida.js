
import { useState, useEffect } from "react";

import Subtitle from "./components/Subtitle.js";
import Link from "./components/Link.js";
import Input from "./components/Input.js";

import "./styles/pages/moneyinput.css";

import saida from "./imgs/icons/saida.png"
import calendar from "./imgs/icons/calendar.png"
import wallet from "./imgs/icons/wallet.png"
import folder from "./imgs/icons/folder.png"
import description from "./imgs/icons/description.png"

function CategorySelect({ onChange, value }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8080/category");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error("Erro ao buscar categorias");
        }
      } catch (error) {
        console.error("Erro na requisição", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <label>
      <img src={folder} alt="Folder" />
      <select id="category" name="input_category" value={value} onChange={onChange} required>
        <option value="" disabled>
          Categoria
        </option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </label>
  );
}


function Saida() {
  const [formData, setFormData] = useState({
    input_money: "",
    input_category: "",
    input_desc: "",
    input_account: "",
    input_date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados enviados:", formData);

  };


  return (
    <div className="MoneyInput">
      <main>
          <Link
            href="/home"
            color="white"
            fontsize="28px"
            decoration="none"
          >
            ← Nova saída
          </Link>
          <form method="post" action={handleSubmit}>
            <div class="value">
              <Subtitle
                color="white"
                fontsize="18px"
              >
                Valor da Saida
              </Subtitle>
              <Input
                label="R$"
                type="text"
                name="input_money"
                max=""
                min=""
                placeholder="0,00"
                required="true"
              >
              </Input>
            </div>
            <div>
            </div>
            <div className="info">
              <CategorySelect
                value={formData.input_category}
                onChange={handleChange}
              />
              <Input
                label={<img src={description} alt='Description' />}
                type="text"
                name="input_desc"
                maxlength=""
                placeholder="Descrição"
              >
              </Input>
              <label>
                <img src={wallet} alt="Account" />
                <select id="account" name="input_account" required>
                  <option value="" disabled selected>Conta</option>
                  <option value="wallet">Carteira</option>
                  <option value="salary">Conta salário</option>
                </select>
              </label>
              <Input
                label={<img src={calendar} alt='Calendar' />}
                type="date"
                name="input_date"
                placeholder="Data"
                required="true"
              >
              </Input>
              <button type="submit">
                <img src={saida} alt="Confirm" />
              </button>
            </div>
          </form>
      </main>
    </div>
  );
}

export default Saida;