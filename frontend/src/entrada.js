import React, { useState, useEffect } from "react";

import Subtitle from "./components/Subtitle.js";
import Link from "./components/Link.js";
import Input from "./components/Input.js";

import "./styles/pages/moneyinput.css";

import entrada from "./imgs/icons/entrada.png";
import calendar from "./imgs/icons/calendar.png";
import wallet from "./imgs/icons/wallet.png";
import folder from "./imgs/icons/folder.png";
import description from "./imgs/icons/description.png";

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

function Entrada() {
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

  const fetchSessionData = async () => {
    try {
      const response = await fetch("http://localhost:8080/session-info");
      if (response.ok) {
        const sessionData = await response.json();
        console.log("Session Data:", sessionData);
        return sessionData;
      } else {
        console.error("Erro ao obter os dados da sessao");
        return null;
      }
    } catch (error) {
      console.error("Erro na requisicao dos dados da sessao");
      return null;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Dados enviados:", formData);

    const sessionData = await fetchSessionData();

    if (sessionData) {
      const transactionData = {
        id: sessionData.accountId,
        account: {
          balanceInCents: sessionData.balanceInCents, 
          accountType: sessionData.accountType, 
          accountNumber: sessionData.accountNumber,
          branchNumber: sessionData.branchNumber,
        },
        transactionType: "credit",
        amountInCents: parseFloat(formData.input_money.replace(",", ".")) * 100,
        description: formData.input_desc,
        transactionDate: {
          year: new Date(formData.input_date).getFullYear(),
          month: new Date(formData.input_date).getMonth() + 1,
          day: new Date(formData.input_date).getDate(),
        },
        category: {
          id: formData.input_category,
          name: "",
          description: "",
        },
        isRecurring: false,
      };

      try{
        const response = await fetch("http://localhost:8080/transaction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transactionData),
        });
        if(response.ok){
          console.log("Transação criada com sucesso!");
        }else{
          console.log("Erro ao criar transacao");
        }
      } catch(error) {
        console.error("Erro na requisicao", error);
      }
    }

  };

  return (
    <div className="MoneyInput">
      <Link href="/home" color="white" fontsize="28px" decoration="none">
        ← Nova entrada
      </Link>

      <form method="post" onSubmit={handleSubmit}>
        <div className="value">
          <Subtitle color="white" fontsize="18px">
            Valor da entrada
          </Subtitle>

          <Input
            label="R$"
            type="text"
            name="input_money"
            placeholder="0,00"
            value={formData.input_money}
            onChange={handleChange}
            required
          />
        </div>

        <div className="info">
          <CategorySelect
            value={formData.input_category}
            onChange={handleChange}
          />

          <Input
            label={<img src={description} alt="Description" />}
            type="text"
            name="input_desc"
            placeholder="Descrição"
            value={formData.input_desc}
            onChange={handleChange}
          />

          <label>
            <img src={wallet} alt="Account" />
            <select
              id="account"
              name="input_account"
              value={formData.input_account}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Conta
              </option>
              <option value="wallet">Carteira</option>
              <option value="salary">Conta salário</option>
            </select>
          </label>

          <Input
            label={<img src={calendar} alt="Calendar" />}
            type="date"
            name="input_date"
            value={formData.input_date}
            onChange={handleChange}
            required
          />

          <button type="submit">
            <img src={entrada} alt="Confirm" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default Entrada;

