/* eslint-disable no-unused-expressions */

import React from "react";
import { useState, useEffect } from "react";
import "./form.css";
import List from "./List";
import postRequest, { getRequest, isArray, url } from "./arr_combiner";
// import PropTypes from "prop-types";
// import UserModel from "../models/UserModel";

let dateValue = '';            // начальное значение даты
let noteValue = '';        // начальное значение дистанции
let tempArr = [];

export default function Form() {  // КОМПОНЕНТ Формы
  
  const [form, setForm] = useState({ // перечисляем все изменяемые параметры внутри формы
    date_input: '',
    note_input: '',
  });

  const [itemsObj, setItemsObj] = useState([]); // массив объектов, передаваемыех в компонент <List />
  const [updated, setUpdated] = useState();

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelector('input').focus();
  });
  
  useEffect(() => { // ОТПРАВКА ДАННЫХ НА СЕРВЕР и ПОЛУЧЕНИЕ ОТВЕТА от сервера 
    async () => {
      const result = await postRequest();
      console.log('data has resived!', result); // КОНТРОЛЬНАЯ ТОЧКА
      console.log('result is Arr = ',isArray(result));  // КОНТРОЛЬНАЯ ТОЧКА

      setItemsObj(prevItemsObj => result);
    }
  }, [updated]);

  const handleDateChange = evt => { // функция обработки набора символов внутри input-а "ДАТА"
    
    setForm(prevForm => ({...prevForm, date_input: evt.target.value}));
    
    if ((!(/[0-9.]/gm.test(evt.target.value))) || // проверка выражения по условию "что-то кроме цифр и точки"
        (evt.target.value.length > 8)) // или длина вставленной в поле строки более 8 символов
       { 
        setForm(prevForm => ({...prevForm, date_input: ''})) // очищаем поле
      };
    
    if ((/(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.]\d\d/gmi.test(evt.target.value)) && evt.target.value.length === 8) { // если в поле "input" набрана корректная дата
      
      setForm(prevForm => ({...prevForm, date_input: evt.target.value}));
      dateValue = evt.target.value;
    }
  }

  const handleDistanceChange = evt => { // функция обработки набора символов внутри input-а "ЗАМЕТКИ"

    setForm(prevForm => ({...prevForm, note_input: evt.target.value}));
    noteValue = evt.target.value;
  }
  
  const handleSubmit = async evt => { // обработка нажатия "Enter"
    evt.preventDefault();
    if ((dateValue !== '') && (noteValue !== '')) { // если все поля "input" корректно заполнены
      
      tempArr = /*{date: dateValue, note: noteValue }*/await postRequest(dateValue, noteValue);
      console.log('tempArr = ', tempArr);  // КОНТРОЛЬНАЯ ТОЧКА
      setItemsObj(prevItemsObj => tempArr);
      
      setUpdated(new Date().getTime());
      console.log('updated is ', updated);  // КОНТРОЛЬНАЯ ТОЧКА

      dateValue = '';
      noteValue = '';
      setForm(prevForm => ({...prevForm, note_input: '', date_input: ''}));
      document.querySelector('input').focus();
    };
  };

  const handleClick = async () => { // ОБРАБОТКА НАЖАТИЯ КНОПКИ "добавить"
    
    if ((dateValue !== '') && (noteValue !== '')) { // если все поля "input" корректно заполнены
      
        tempArr = /*{date: dateValue, note: noteValue };*/await postRequest(dateValue, noteValue);
        console.log('tempArr = ', tempArr);  // КОНТРОЛЬНАЯ ТОЧКА
        setItemsObj(prevItemsObj => tempArr);

        setUpdated(new Date().getTime()); 
        console.log('updated is ', updated);  // КОНТРОЛЬНАЯ ТОЧКА
         
      dateValue = '';
      noteValue = '';
      setForm(prevForm => ({...prevForm, note_input: '', date_input: ''}));
      document.querySelector('input').focus();
    };
  };

  const handleRemove = async evt => {  // ОБРАБОТКА НАЖАТИЯ КРЕСТИКА "удалить", передаваемая в компонент <List />
    const { target } = evt;
    const id = target.parentElement.id;
    console.log('removed ID = ', id);   // КОНТРОЛЬНАЯ ТОЧКА
    
    await fetch(`${url}/notes/${id}`, {    // отправка DELET-запроса на сервер
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json;charset=utf-8'
      }
    });
  
    tempArr = await getRequest();
    setItemsObj(prevItemsObj => tempArr);

  };

  const handleClick2= async evt => {  // ОБРАБОТКА НАЖАТИЯ КНОПКИ "Обновить", передаваемая в компонент <List />
    
    tempArr = await getRequest();
    setItemsObj(prevItemsObj => tempArr);

  };

  return (
    <main className="content">
        <div className="card">
          <div className="tasks" id="tasks">
          <button className="tasks__renew" onClick={handleClick2} id="tasks__renew">Обновить</button>
            <form className="tasks__control" onSubmit={handleSubmit} id="tasks__form">
              <label htmlFor="date_input">Дата (ДД.ММ.ГГ)
                <input 
                  type="text" 
                  className="tasks__input" 
                  name="date_input" 
                  id="date__input" 
                  placeholder="Введите датау"
                  value={form.date_input}
                  onChange={handleDateChange} />
              </label>
              <label htmlFor="note_input">ЗАМЕТКИ
                <input type="text" 
                  className="tasks__input" 
                  name="note_input" 
                  id="note__input" 
                  placeholder="Введите текст"
                  value={form.note_input}
                  onChange={handleDistanceChange} />
              </label>
              <button className="tasks__add" onClick={handleClick} id="tasks__add">Добавить</button>
            </form>
            <List itemsObj={itemsObj} onRemove={handleRemove}/>
          </div>
        </div>
    </main>
  );
};

List.defaultProps = {
  dataArr: []
  };

/*
ShopItemFunc.propTypes = {
  itemArray: PropTypes.arrayOf(UserModel).isRequired
}
*/