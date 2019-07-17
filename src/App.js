import React, { useState, useEffect} from 'react';
import {DateTime} from 'luxon';
import _ from 'lodash';
// import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Grid, Button, Segment, Icon, Modal, Header, Form, Divider, Card} from "semantic-ui-react";
import axios from 'axios';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import 'semantic-ui-css/semantic.min.css';

const App = () => {
    let dateCounter = 1;
    let mas2 = [];
    let counter = 1;
    const DATA = DateTime.local();
    const [curDate, setCurDate] = useState(DateTime.local());
    const [modal, changeModal] = useState(false);
    const [formTitle, setFormTitle] = useState();
    const [formPlace, setFormPlace] = useState();
    const [formDate, setFormDate] = useState();
    const [formStart, setFormStart] = useState();
    const [formEnd, setFormEnd] = useState();
    const [month, setMonth] = useState({eventsMonth: []});
    const [eventsYear, setEventsYear] = useState({eventsYear: []});
    const [view, setView] = useState(1);

    useEffect(() => {
        async function fetchMonth() {
            const response = await axios ('http://127.0.0.1:3020/events/list');
            let z = 0;
            let mas = [];
            let mas3 = [];
            for (let i = 0; i < response.data.length; i++) {
                let d = Date.parse(response.data[i].date_exe);
                let c = new Date(d);

                if ((c.getMonth() + 1 === curDate.month) && (c.getFullYear() === curDate.year)) {
                    mas.push(response.data[i].description);
                    mas2.push(c.getDate());
                    z++;
                }
                if (c.getFullYear() === curDate.year){
                    mas3.push({
                    id: response.data[i].id,
                    title: response.data[i].title,
                    description: response.data[i].description,
                    date_creation: response.data[i].date_creation,
                    duration: response.data[i].duration,
                    author_id: parseInt(response.data[i].author_id),
                    date_exe_year: parseInt(response.data[i].date_exe.split('-')[0]),
                    date_exe_month: parseInt(response.data[i].date_exe.split('-')[1]),
                    date_exe_day: parseInt(response.data[i].date_exe.split('-')[2]),
                    date_exe_hour: parseInt(response.data[i].date_exe.split('T')[1].split(':')[0]),
                    date_exe_hour_str: response.data[i].date_exe.split('T')[1].split(':')[0],
                    date_exe_minute: parseInt(response.data[i].date_exe.split('T')[1].split(':')[1]),
                    date_exe_minute_str: response.data[i].date_exe.split('T')[1].split(':')[1],
                    date_exe_second: parseInt(response.data[i].date_exe.split('T')[1].split(':')[2]),
                    event_start_in_minute: parseInt(response.data[i].date_exe.split('T')[1].split(':')[0]) * 60 +
                                           parseInt(response.data[i].date_exe.split('T')[1].split(':')[1]),
                    duration_in_minute: parseInt(response.data[i].duration)/60,
                    is_exactly_start: ((parseInt(response.data[i].date_exe.split('T')[1].split(':')[0])) * 60 +
                        parseInt(response.data[i].date_exe.split('T')[1].split(':')[1])) % 60 === 0,
                    event_end_in_minute: parseInt(response.data[i].date_exe.split('T')[1].split(':')[0]) * 60 +
                        parseInt(response.data[i].date_exe.split('T')[1].split(':')[1]) + parseInt(response.data[i].duration)/60,
                    hour_end: (parseInt(response.data[i].date_exe.split('T')[1].split(':')[0]) * 60 +
                        parseInt(response.data[i].date_exe.split('T')[1].split(':')[1]) + parseInt(response.data[i].duration)/60)/60,
                    // event_end_in_minute_str: ('0' + parseInt(response.data[i].date_exe.split('T')[1].split(':')[0]) * 60 +
                    //     parseInt(response.data[i].date_exe.split('T')[1].split(':')[1]) + parseInt(response.data[i].duration)/60).slice(-2),
                    event_end_in_minute_str: ('0' + (parseInt(response.data[i].date_exe.split('T')[1].split(':')[0]) * 60 +
                            parseInt(response.data[i].date_exe.split('T')[1].split(':')[1]) + parseInt(response.data[i].duration)/60)%60).slice(-2),
                    });
                }
            }
            setMonth(mas2);
            setEventsYear(mas3);
        }
        fetchMonth();
    }, [curDate]);

    // function Datepicker() {
    //     function onDateChange(e) {
    //     }
    //     return (<SemanticDatepicker onDateChange={onDateChange} />)
    // }

    function onSubmit(e) {
        e.preventDefault();
        let reqSQL = {};
        reqSQL.title = formTitle.title;
        reqSQL.description = formPlace.place;
        reqSQL.date_exe = formDate.date + ' ' + formStart.start;
        let duration_start = parseInt(formStart.start.split(':')[0])*60 + parseInt(formStart.start.split(':')[1]);
        let duration_end = parseInt(formEnd.end.split(':')[0])*60 + parseInt(formEnd.end.split(':')[1]);
        reqSQL.duration = (duration_end - duration_start)*60;
        console.log(reqSQL);

        let postData = Object.keys(reqSQL).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(reqSQL[key]);
        }).join('&');
        axios.post('http://localhost:3020/events/add', postData, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        )
        .then(
            () => {changeModal(!modal)})
        .catch(e => console.log(e));
    }

    function ModalWindow(){
        return (
            <Modal open={modal} size='large'>
                <Header icon='plane' content='    Создать новое событие' style={{backgroundColor:'pink', textAlign:'center'}}  />
                <Modal.Content>
                    <Form onSubmit={onSubmit}>
                        <Form.Group>
                            <Form.Field>
                                <label>Название событие</label>
                                <Form.Input type='text' placeholder='Название события' name='title' onChange={e=>setFormTitle({title : e.target.value})} />
                            </Form.Field>
                            <Form.Field>
                                <label>Место события</label>
                                <Form.Input type='text' placeholder='Место события' name='place' onChange={e=>setFormPlace({place : e.target.value})} />
                            </Form.Field>
                            {/*<Form.Field>*/}
                            {/*    <label>Дата</label>*/}
                            {/*    <Datepicker type='text' name='date_exe'  placeholder="Дата" onChange={e=>console.log({date : e.target.value})}/>*/}
                            {/*</Form.Field>*/}
                            <Form.Field>
                                <label>Дата</label>
                                <Form.Input type='text' placeholder='2019-07-12' name='place' onChange={e=>setFormDate({date : e.target.value})} />
                            </Form.Field>
                            <Form.Field>
                                <label>Время начала</label>
                                <Form.Input type='text' placeholder='08:00' name='place' onChange={e=>setFormStart({start : e.target.value})} />
                            </Form.Field>
                            <Form.Field>
                                <label>Время окончания</label>
                                <Form.Input type='text' placeholder='10:00' name='place' onChange={e=>setFormEnd({end : e.target.value})} />
                            </Form.Field>
                            <Modal.Actions>
                                <Button color='green' type="submit" style={{marginTop: '10px'}}>
                                    <Icon name='checkmark' />
                                    Создать событие
                                </Button>
                            </Modal.Actions>
                        </Form.Group>
                    </Form>
                    <Button color='pink' onClick={() => changeModal(!modal)}>
                        <Icon name='remove' /> Закрыть окно
                    </Button>
                </Modal.Content>
            </Modal>
        )
    }

    function isWeekends(i){
        let zz = curDate;
        let mm = zz.day;
        let nn = zz.minus({days: mm - 1 }).weekday;

        if(nn + i === 6 || nn + i === 7 || nn + i === 13 || nn + i === 14 || nn + i === 20 || nn + i === 21 ||
            nn + i === 27 || nn + i === 28 || nn + i === 34 || nn + i === 35){
            return true;
        }
    }

    function isWeekendsForWeek(i){
        let zz = curDate;
        let mm = zz.day;
        let nn = zz.minus({days: mm - 1 }).weekday;

        if(nn + i === 6 || nn + i === 7 || nn + i === 13 || nn + i === 14 || nn + i === 20 || nn + i === 21 ||
            nn + i === 27 || nn + i === 28 || nn + i === 34 || nn + i === 35){
            return true;
        }
    }

    function isWeekendsForYear(i){
        let zz = curDate;
        let ss = zz.set({year: curDate.year, month: counter - 1, day: 1});
        let mm = ss.day;
        let nn = ss.minus({days: mm - 1 }).weekday;

        if(nn + i === 6 || nn + i === 7 || nn + i === 13 || nn + i === 14 || nn + i === 20 || nn + i === 21 ||
            nn + i === 27 || nn + i === 28 || nn + i === 34 || nn + i === 35){
            return true;
        }
    }

    function daysGrid() {
        return (
            _.times(curDate.daysInMonth, i => (
                <Grid.Column key={i} >
                    {checkCurDay(i)}
                </Grid.Column>
            ))
        )
    }

    function daysGridForYear() {
        let zz = curDate;
        let mm = zz.set({year: curDate.year, month: counter - 1, day: 1});
        return (
            _.times(mm.daysInMonth, i => (
                <Grid.Column key={i} >
                    {checkCurDayForYear(i)}
                </Grid.Column>
            ))
        )
    }

    function checkCurDay(i) {
        let style = '14px';
        for (let k = 0; k < month.length; k++){
            if (i + 1 === month[k]){
                style = '19px';
            }
        }

        if ((i + 1 === curDate.day) && (curDate.year === DATA.year) && (curDate.month === DATA.month)){
            return (
                <Button icon primary labelPosition='right' fluid style={{marginTop: '10px', fontWeight: 'bold', fontSize: style }} onClick={() => changeModal(!modal)}>
                    <Icon name='plus' />
                    {dayMonth(i)}
                </Button>
            )
        }
        else if (isWeekends(i)){
            return (
                <Button icon basic color='pink' labelPosition='right' fluid style={{marginTop: '10px', fontSize: style}} onClick={() => changeModal(!modal)} >
                    <Icon name='plus' />
                    {dayMonth(i)}
                </Button>
            )
        }
        return (
            <Button icon basic color='teal' labelPosition='right' fluid style={{marginTop: '10px', fontSize: style}} onClick={() => changeModal(!modal)}>
                <Icon name='plus' />
                {dayMonth(i)}
            </Button>
        )
    }

    function checkCurDayForYear(i) {
        let style = '14px';

        for (let k = 0; k < Object.keys(eventsYear).length; k++){
            if (! (eventsYear[k] === undefined)){
                if ((i + 1 === eventsYear[k].date_exe_day) && (eventsYear[k].date_exe_month === counter - 1)){
                    style = '19px';
                }
            }
        }

        if (DATA.month + 1 === counter){
            if ((i + 1 === curDate.day) && (curDate.year === DATA.year) && (curDate.month === DATA.month) && (curDate.day === DATA.day)){
                return (
                    <Button icon primary labelPosition='right' fluid style={{margin: '2px', fontWeight: 'bold', fontSize: style }} onClick={() => changeModal(!modal)}>
                        {dayMonthForYear(i)}
                    </Button>
                )
            }
        }

        if (isWeekendsForYear(i)){
            return (
                <Button icon basic color='pink' labelPosition='right' fluid style={{margin: '2px', fontSize: style}} onClick={() => changeModal(!modal)} >
                    {dayMonthForYear(i)}
                </Button>
            )
        }

        return (
            <Button icon basic color='teal' labelPosition='right' fluid style={{margin: '2px', fontSize: style}} onClick={() => changeModal(!modal)}>
                {dayMonthForYear(i)}
            </Button>
        )
    }

    function monthName() {
        let mas = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль',
            'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        return mas[curDate.month - 1];
    }

    function monthNameForYear() {
        counter ++;
        let mas = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль',
            'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        return mas[counter - 2];
    }

    function dayMonth(i) {
        let mas = [];
        for (let j = 1; j <= curDate.daysInMonth; j++){
            mas.push(j);
        }
        return mas[i];
    }

    function dayMonthForYear(i) {
        let zz = curDate;
        let mm = zz.set({year: curDate.year, month: counter - 1, day: 1});
        let mas = [];
        for (let j = 1; j <= mm.daysInMonth; j++){
            mas.push(j);
        }
        return mas[i];
    }

    function firstMonthDay(){
        let zz = curDate;
        let mm = zz.day;
        let nn = zz.minus({days: mm - 1 }).weekday;
        return nn - 1;
    }

    function firstMonthDayForYear(){
        let zz = curDate;
        let curYear = zz.set({year: curDate.year, month: counter - 1, day: 1});
        let mm = curYear.day;
        let nn = curYear.minus({days: mm - 1 }).weekday;
        return nn - 1;
    }

    function dayWeek(i) {
        let mas = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'];
        return mas[i];
    }

    function dayWeekForYear(i) {
        let mas = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
        return mas[i];
    }

    function hourInDayForDay(i){
        let mas = ['00:00 — 00:59', '01:00 — 01:59', '02:00 — 02:59', '03:00 — 03:59', '00:04 — 04:59', '05:00 — 05:59',
            '06:00 — 06:59', '07:00 — 07:59', '08:00 — 08:59', '09:00 — 09:59', '10:00 — 10:59', '11:00 — 11:59',
            '12:00 — 12:59', '13:00 — 13:59', '14:00 — 14:59', '15:00 — 15:59', '16:00 — 16:59', '17:00 — 17:59',
            '18:00 — 18:59', '19:00 — 19:59', '20:00 — 20:59', '21:00 — 21:59', '22:00 — 22:59', '23:00 — 23:59'];
        return mas[i];
    }

    function hourInDayForWeek(i){
        let mas = ['00:00 — 00:59', '01:00 — 01:59', '02:00 — 02:59', '03:00 — 03:59', '00:04 — 04:59', '05:00 — 05:59',
            '06:00 — 06:59', '07:00 — 07:59', '08:00 — 08:59', '09:00 — 09:59', '10:00 — 10:59', '11:00 — 11:59',
            '12:00 — 12:59', '13:00 — 13:59', '14:00 — 14:59', '15:00 — 15:59', '16:00 — 16:59', '17:00 — 17:59',
            '18:00 — 18:59', '19:00 — 19:59', '20:00 — 20:59', '21:00 — 21:59', '22:00 — 22:59', '23:00 — 23:59'];
        return mas[i];
    }

    function nameForDayInWeek(i) {
        return (
            <Header as='h4' color='black' style={{textAlign: 'center'}}>
                {dayWeekForYear(i)}
            </Header>);
    }

     function retCalendarGrid() {
        return (
            <React.Fragment>
                {_.times(firstMonthDay(), i => (
                    <Grid.Column key={i} >
                        <Button icon basic content='' fluid style={{marginTop: '10px' , visibility : 'hidden' }}/>
                    </Grid.Column>
                ))}
                {daysGrid()}
            </React.Fragment>
        )
    }

    function retCalendarGridForYear() {
        return (
            <React.Fragment>
                {_.times(firstMonthDayForYear(), i => (
                    <Grid.Column key={i} >
                        <Button icon basic content='' fluid style={{marginTop: '10px' , visibility : 'hidden' }}/>
                    </Grid.Column>
                ))}
                {daysGridForYear()}
            </React.Fragment>
        )
    }

    function isEventForDay(){
        let mas = [];
        for (let k = 0; k < Object.keys(eventsYear).length; k++){
            if (eventsYear[k] !== undefined){
                if ((eventsYear[k].date_exe_day === curDate.day) && (eventsYear[k].date_exe_month === curDate.month) && (eventsYear[k].date_exe_year === curDate.year)){
                    mas.push(eventsYear[k]);
                }
            }
        }
        return mas;
    }

    function longEventForDay(todayEvents) {
        function calcHourEnd (todayEvents){
            if (todayEvents.event_end_in_minute % 60 === 0){
                return (Math.floor(todayEvents.event_end_in_minute / 60) - 1)
            }else{
                return Math.floor(todayEvents.event_end_in_minute / 60);
            }
        }

        let arr = [];
        for (let i = 0; i < todayEvents.length; i++){
            if (todayEvents[i].date_exe_hour + 1 === todayEvents[i].event_end_in_minute/60){//если встреча укладывается ровно в час
                let hourStart = Math.floor(todayEvents[i].event_start_in_minute/60);
                arr.visible_hour = hourStart;
                arr.push(todayEvents[i]);
            }else if(Math.floor(todayEvents[i].hour_end) > todayEvents[i].date_exe_hour){//если встреча не укладывается в один час
                    let hourStart = Math.floor(todayEvents[i].event_start_in_minute/60);
                    let hourEnd = calcHourEnd(todayEvents[i]);
                    for (let k = 0; k <= hourEnd - hourStart; k++){
                        let copy = Object.assign({}, todayEvents[i]);
                        copy.visible_hour = hourStart + k;
                        arr.push(copy);
                    }
                }
            }
        return arr;
    }

    function fillEventsForDay(todayEventsLong, i) {
        let mas = [];
        for (let z = 0; z < todayEventsLong.length; z++){
            if (i === todayEventsLong[z].visible_hour){
                mas.push(todayEventsLong[z]);
            }
        }
        return ( <Card.Group>
            {mas.map(item => {
                return(
                    <Card key={item.id}>
                        <Card.Content>
                            <Card.Header style={{textAlign: 'center'}}>{item.title}</Card.Header>
                            <Card.Meta>Время начала: {item.date_exe_hour_str}:{item.date_exe_minute_str}</Card.Meta>
                            <Card.Meta>Продолжительность: {Math.floor(item.duration_in_minute)} минут</Card.Meta>
                            <Card.Meta>Окончание: {Math.floor(item.event_end_in_minute / 60)}:{item.event_end_in_minute_str}</Card.Meta>
                            <Card.Description>{item.description} ----------------its a description</Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <div className='ui two buttons'>
                                <Button basic color='red'>
                                    Отменить
                                </Button>
                            </div>
                        </Card.Content>
                    </Card>
                )
            })}
        </Card.Group>)
    }

    // function eventsCounter(todayEventsLong, i) {
    //     let counter = 0;
    //     if (todayEventsLong.length > 0){
    //         todayEventsLong.forEach( (todayEvents) => {
    //             if (todayEvents.visible_hour === i){
    //                 counter++;
    //             }
    //         })
    //     }
    //     return counter;
    // }

    function retMonth() {
        return (<Grid.Row>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Grid columns={7}>
                            <Grid.Row>
                                { _.times(7, i => (
                                    <Grid.Column key={i} >
                                        <Segment color='orange' textAlign='center'>{dayWeekForYear(i)}</Segment>
                                    </Grid.Column>))}
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <React.Fragment>
                            <Grid columns={7} >
                                <Grid.Row style={{marginTop: '20px'}}>
                                    { retCalendarGridForYear() }
                                    {/*{ ModalWindow() }*/}
                                </Grid.Row>
                            </Grid>
                        </React.Fragment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Grid.Row>)
    }

    function retViewMonth() {
        return (
            <Grid columns={1} centered style={{marginLeft: '10px', marginRight: '10px'}}>
                <Grid.Row>
                    <Grid celled>
                        <Grid.Row >
                            <Grid.Column width={4}>
                                <Grid style={{ justifyContent: 'space-evenly'}}>
                                    <Grid.Column>
                                        <h1>{monthName()}    {curDate.year}</h1>
                                    </Grid.Column>
                                </Grid>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Button.Group fluid>
                                    <Button onClick={() => setView(1)}>День</Button>
                                    <Button onClick={() => setView(2)}>Неделя</Button>
                                    <Button onClick={() => setView(0)}>Месяц</Button>
                                    <Button onClick={() => setView(3)}>Год</Button>
                                </Button.Group>
                            </Grid.Column>

                            <Grid.Column width={4}>
                                <Grid style={{ justifyContent: 'space-evenly'}}>
                                    <Grid.Row>
                                        <Button icon='angle double left' onClick={() => setCurDate(curDate.minus({month: 1}))}/>
                                        <Button color='grey' onClick={() => setCurDate(DateTime.local())}>Сегодня</Button>
                                        <Button icon='angle double right' onClick={() => setCurDate(curDate.plus({month: 1}))}/>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Row>
                <Grid.Row>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Grid columns={7}>
                                    <Grid.Row>
                                        { _.times(7, i => (
                                            <Grid.Column key={i} >
                                                <Segment color='orange' textAlign='center'>{dayWeek(i)}</Segment>
                                            </Grid.Column>))}
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <React.Fragment>
                                    <Grid columns={7} >
                                        <Grid.Row style={{marginTop: '20px'}}>
                                            { retCalendarGrid() }
                                            {ModalWindow()}
                                        </Grid.Row>
                                    </Grid>
                                </React.Fragment>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Row>
            </Grid>
        );
    }

    function retViewYear() {
        return (
            <Grid columns={1} centered style={{marginLeft: '10px', marginRight: '10px'}}>
                <Grid.Row>
                    <Grid celled>
                        <Grid.Row >
                            <Grid.Column width={4}>
                                <Grid style={{ justifyContent: 'space-evenly'}}>
                                    <Grid.Column>
                                        <h1>{curDate.year}</h1>
                                        {ModalWindow()}
                                    </Grid.Column>
                                </Grid>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Button.Group fluid>
                                    <Button onClick={() => setView(1)}>День</Button>
                                    <Button onClick={() => setView(2)}>Неделя</Button>
                                    <Button onClick={() => setView(0)}>Месяц</Button>
                                    <Button onClick={() => setView(3)}>Год</Button>
                                </Button.Group>
                            </Grid.Column>

                            <Grid.Column width={4}>
                                <Grid style={{ justifyContent: 'space-evenly'}}>
                                    <Grid.Row>
                                        <Button icon='angle double left' onClick={() => setCurDate(curDate.minus({year: 1}))}/>
                                        <Button color='grey' onClick={() => setCurDate(DateTime.local())}>Сегодня</Button>
                                        <Button icon='angle double right' onClick={() => setCurDate(curDate.plus({year: 1}))}/>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Row>

                <Grid columns={4} divided style={{textAlign : 'center'}}>
                    {_.times(3, i =>(
                        <Grid.Row key={i}>
                            {_.times(4, i =>(
                                <Grid.Column key={i}>
                                    <Segment color='blue' textAlign='center'>{monthNameForYear()}</Segment>
                                    {retMonth()}
                                </Grid.Column>
                            ))}
                        </Grid.Row>
                    ))}
                </Grid>

            </Grid>
        );
    }

    function overflowForWeek(i, dateValue) {
        if (dateValue.day + i > dateValue.daysInMonth){
            return dateCounter++;
        }else{
            return dateValue.day + i;
        }
    }

    function dateForDayInWeek(i){
        let zz = curDate;
        let dateValue = zz.set({year: curDate.year, month: curDate.month, day: curDate.day - curDate.weekday + 1});

        if (i + 1 === DATA.weekday && curDate.month === DATA.month && curDate.year === DATA.year && curDate.day === DATA.day){
            return (
                <Header as='h3' color='blue' style={{textAlign: 'center', marginTop: '7px'}}>
                    {zz.day}
                </Header>
            );
        }
        if (isWeekendsForWeek(i)){
            return (
            <Header as='h3' color='red' style={{textAlign: 'center', marginTop: '7px'}}>
                {overflowForWeek(i, dateValue)}
            </Header>)
        }
        return (
            <div style={{borderRadius: '50%', borderColor: 'blue', borderWidth: '2px' }}>
                <Header as='h3' color='black' style={{textAlign: 'center', marginTop: '7px'}}>
                    {overflowForWeek(i, dateValue)}
                </Header>
            </div>
        );
    }

    function longEventForWeek(weekEvents) {
        function calcHourEnd (weekEvents){
            if (weekEvents.event_end_in_minute % 60 === 0){
                return (Math.floor(weekEvents.event_end_in_minute / 60) - 1)
            }else{
                return Math.floor(weekEvents.event_end_in_minute / 60);
            }
        }

        let arr = [];
        for (let i = 0; i < weekEvents.length; i++){
            if (weekEvents[i].date_exe_hour + 1 === weekEvents[i].event_end_in_minute/60){//если встреча укладывается ровно в час
                let hourStart = Math.floor(weekEvents[i].event_start_in_minute/60);
                arr.visible_hour = hourStart;
                arr.push(weekEvents[i]);
            }else if(Math.floor(weekEvents[i].hour_end) > weekEvents[i].date_exe_hour){//если встреча не укладывается в один час
                let hourStart = Math.floor(weekEvents[i].event_start_in_minute/60);
                let hourEnd = calcHourEnd(weekEvents[i]);
                for (let k = 0; k <= hourEnd - hourStart; k++){
                    let copy = Object.assign({}, weekEvents[i]);
                    copy.visible_hour = hourStart + k;
                    arr.push(copy);
                }
            }
        }
        return arr;
    }

    function retFillWeek(i,j) {
        let zz = curDate;
        let dateValueMon = zz.set({year: curDate.year, month: curDate.month, day: curDate.day - curDate.weekday + 1});

        if (i === 5 || i === 6){
            return (
                   <Button icon='plus' basic color='red' onClick={() => changeModal(!modal)}></Button>
            )
        }else{
            return(
                <Button icon='plus' basic color='teal' onClick={() => changeModal(!modal)}></Button>

            )
        }
    }

    function isEventForWeek() {
        let zz = curDate;
        let dateValueMon = zz.set({year: curDate.year, month: curDate.month, day: curDate.day - curDate.weekday + 1});
        let temporaryDate = dateValueMon;
        let mas = [];

        for (let y = 0; y < 7; y++){
            for (let i = 0; i < Object.keys(eventsYear).length; i++){
                if (eventsYear[i] !== undefined){
                    if ((eventsYear[i].date_exe_day === temporaryDate.day) && (eventsYear[i].date_exe_month === temporaryDate.month) && (eventsYear[i].date_exe_year === temporaryDate.year)){
                        mas.push(eventsYear[i]);
                    }
                }
            }
            temporaryDate = temporaryDate.plus({day: 1});
        }
        return mas;
    }

    function fillMarkForWeek(i, j, weekEventsLong) {
        let zz = curDate;
        let dateValueMon = zz.set({year: curDate.year, month: curDate.month, day: curDate.day - curDate.weekday + 1});

        let temporaryDate = dateValueMon.plus({day: i});

        for (let i = 0; i < Object.keys(eventsYear).length; i++){
            if (weekEventsLong[i] !== undefined){
                if(temporaryDate.day === weekEventsLong[i].date_exe_day && temporaryDate.month === weekEventsLong[i].date_exe_month
                    && temporaryDate.year === weekEventsLong[i].date_exe_year && j === weekEventsLong[i].visible_hour){
                    return (<Icon size='big' name='hourglass' color='red' />)
                }
            }

        }
    }

    function retViewWeek() {
        let weekEvents = isEventForWeek();
        let weekEventsLong = longEventForWeek(weekEvents);
        return (
            <React.Fragment>
            <Grid columns={1} centered style={{marginLeft: '10px', marginRight: '10px'}}>
                <Grid.Row>
                    <Grid celled>
                        <Grid.Row >
                            <Grid.Column width={4}>
                                <Grid style={{ justifyContent: 'space-evenly'}}>
                                    <Grid.Column>
                                        {ModalWindow()}
                                        <h1>{monthName()}    {curDate.year}</h1>
                                    </Grid.Column>
                                </Grid>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Button.Group fluid>
                                    <Button onClick={() => setView(1)}>День</Button>
                                    <Button onClick={() => setView(2)}>Неделя</Button>
                                    <Button onClick={() => setView(0)}>Месяц</Button>
                                    <Button onClick={() => setView(3)}>Год</Button>
                                </Button.Group>
                            </Grid.Column>

                            <Grid.Column width={4}>
                                <Grid style={{ justifyContent: 'space-evenly'}}>
                                    <Grid.Row>
                                        <Button icon='angle double left' onClick={() => setCurDate(curDate.minus({week: 1}))}/>
                                        <Button color='grey' onClick={() => setCurDate(DateTime.local())}>Сегодня</Button>
                                        <Button icon='angle double right' onClick={() => setCurDate(curDate.plus({week: 1}))}/>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Row>

                <Grid columns={7}>
                        <Grid.Row>
                            {_.times(7, i => (
                            <Grid.Column key={i}>
                                <Segment color='orange' textAlign='left' style={{fontSize: '30px', marginBottom: '10px' }}>{nameForDayInWeek(i)}     {dateForDayInWeek(i)}</Segment>
                                {_.times(24, j => (
                                    <React.Fragment key={j}>
                                        <Divider horizontal  >{hourInDayForWeek(j)}</Divider>
                                        <Segment>
                                            <Grid columns={3}>
                                                <Grid.Column width={1} style={{textAlign: 'left'}} verticalAlign='middle'>
                                                    {retFillWeek(i,j)}
                                                </Grid.Column>
                                                <Grid.Column width={1} style={{textAlign: 'left'}} verticalAlign='middle'>

                                                </Grid.Column>
                                                <Grid.Column width={1} style={{textAlign: 'right'}} verticalAlign='middle'>
                                                    {fillMarkForWeek(i, j, weekEventsLong)}
                                                </Grid.Column>
                                            </Grid>
                                        </Segment>
                                    </React.Fragment>
                                ))}
                            </Grid.Column>
                            ))}
                        </Grid.Row>
                </Grid>
            </Grid>
            </React.Fragment>
        );
    }

    function retViewDay() {
        let todayEvents =  isEventForDay();
        let todayEventsLong = longEventForDay(todayEvents);
        return (
            <Grid columns={1} centered style={{marginLeft: '10px', marginRight: '10px'}}>
                <Grid.Row>
                    <Grid celled>
                        <Grid.Row >
                            <Grid.Column width={4}>
                                <Grid style={{ justifyContent: 'space-evenly'}}>
                                    <Grid.Column>
                                        {ModalWindow()}
                                        <h1>{curDate.day}    {monthName()}    {curDate.year}</h1>
                                    </Grid.Column>
                                </Grid>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Button.Group fluid>
                                    <Button onClick={() => setView(1)}>День</Button>
                                    <Button onClick={() => setView(2)}>Неделя</Button>
                                    <Button onClick={() => setView(0)}>Месяц</Button>
                                    <Button onClick={() => setView(3)}>Год</Button>
                                </Button.Group>
                            </Grid.Column>

                            <Grid.Column width={4}>
                                <Grid style={{ justifyContent: 'space-evenly'}}>
                                    <Grid.Row>
                                        <Button icon='angle double left' onClick={() => setCurDate(curDate.minus({day: 1}))}/>
                                        <Button color='grey' onClick={() => setCurDate(DateTime.local())}>Сегодня</Button>
                                        <Button icon='angle double right' onClick={() => setCurDate(curDate.plus({day: 1}))}/>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Row>

                <Grid columns={1}>
                    <Grid.Row >
                        <Grid.Column>
                            <Segment color='orange' textAlign='center' style={{fontSize: '30px', marginBottom: '10px'}}>{dayWeek(curDate.weekday - 1)}</Segment>
                                {_.times(24, i => (
                                <React.Fragment key={i}>
                                    <Divider horizontal  >{hourInDayForDay(i)}</Divider>
                                    <Segment>
                                        <Grid columns={3}>
                                            <Grid.Column width={15} >
                                                {fillEventsForDay(todayEventsLong, i)}
                                                {/*{eventsCounter(todayEventsLong, i)}*/}
                                            </Grid.Column>

                                            <Grid.Column width={1} style={{textAlign: 'right'}} verticalAlign='middle'>
                                                <Button icon='plus' basic color='teal' onClick={() => changeModal(!modal)}></Button>
                                            </Grid.Column>
                                        </Grid>
                                    </Segment>
                                </React.Fragment>
                                ))}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Grid>
        );
    }

    function selectorView() {
        if (view === 0){
            return retViewMonth();
        }else if (view === 1){
            return retViewDay();
        }else if (view === 2){
            return retViewWeek();
        }else if (view === 3){
            return retViewYear();
        }
    }

    return (selectorView());/// это вызывается при рендере APP
};

export default App;