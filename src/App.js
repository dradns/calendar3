import React, { useState, useEffect} from 'react';
import {DateTime, Duration, Info, Interval, Settings} from 'luxon';
import _ from 'lodash';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Grid, Button, Segment, Icon, Modal, Header, Form} from "semantic-ui-react";
import axios from 'axios';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import 'semantic-ui-css/semantic.min.css';
import GridColumn from "semantic-ui-react/dist/commonjs/collections/Grid/GridColumn";

const App = () => {
    let mas2 = [];
    let counter = 1;
    const DATA = DateTime.local();
    const [curDate, setCurDate] = useState(DateTime.local());
    const [modal, changeModal] = useState(false);
    const [event, setEvent] = useState({ events: [] });
    const [month, setMonth] = useState({eventsMonth: []});

    useEffect(() => {
        async function fetchData() {
            const response = await axios ('http://127.0.0.1:3020/events/list');
            setEvent(response.data);
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchMonth() {
            const response = await axios ('http://127.0.0.1:3020/events/list');
            let z = 0;
            let mas = [];
            for (let i = 0; i < response.data.length; i++) {
                let d = Date.parse(response.data[i].date_exe);
                let c = new Date(d);

                if ((c.getMonth() + 1 === curDate.month) && (c.getFullYear() === curDate.year)) {
                    mas.push(response.data[i].description);
                    mas2.push(c.getDate());
                    z++;
                }
            }
            setMonth(mas2);
        }
        fetchMonth();
    }, [curDate]);

    function isWeekends(i){
        let zz = curDate;
        let mm = zz.day;
        let nn = zz.minus({days: mm - 1 }).weekday;

        if(nn + i === 6 || nn + i === 7 || nn + i === 13 || nn + i === 14 || nn + i === 20 || nn + i === 21 ||
            nn + i === 27 || nn + i === 28 || nn + i === 34 || nn + i === 35){
            return true;
        }
    }

    function Datepicker() {
        function onDateChange(e) {
        }
        return (<SemanticDatepicker onDateChange={onDateChange} />)
    }

    function onSubmit(e) {
        e.preventDefault();
        setEvent({ title: event.target.title, place: event.target.place,  date_exe: event.target.date_exe});
    }

    function ModalWindow(){
        console.log('its a modal window');
        return (
            <Modal open={modal} size='large'>
                <Header icon='plane' content='    Создать новое событие' style={{backgroundColor:'pink', textAlign:'center'}}  />
                <Modal.Content>
                    <Form onSubmit={onSubmit}>
                        <Form.Group>
                            <Form.Input type='text' placeholder='Название события' name='title' onChange={e=>setEvent({title : e.target.value})} />
                            <Form.Input type='text' placeholder='Место события' name='place' onChange={e=>setEvent({place : e.target.value})} />
                            <Datepicker type='text' name='date_exe'  placeholder="Дата"/>
                            <Modal.Actions>
                                <Button color='green' type="submit">
                                    <Icon name='checkmark' /> Создать событие
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

    // function firstMonthDayForYear(){
    //     let zz = curDate;
    //     let curYear = zz.set({year: curDate.year, month: counter - 1, day: 1});
    //     let mm = curYear.day;
    //     let nn = curYear.minus({days: mm - 1 }).weekday;
    //     return nn - 1;
    // }

    function checkCurDay(i) {
        let style = '14px';
        for (let k = 0; k < month.length; k++){
            if (i + 1 === month[k]){
                style = '19px';
            }
        }

        if ((i === curDate.day - 1) && (curDate.year === DATA.year) && (curDate.month === DATA.month)){
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
        for (let k = 0; k < month.length; k++){
            if (i + 1 === month[k]){
                style = '19px';
            }
        }

        if ((i === curDate.day - 1) && (curDate.year === DATA.year) && (curDate.month === DATA.month)){
            return (
                <Button icon primary labelPosition='right' fluid style={{margin: '2px', fontWeight: 'bold', fontSize: style }} onClick={() => changeModal(!modal)}>
                    {dayMonth(i)}
                </Button>
            )
        }
        else if (isWeekends(i)){
            return (
                <Button icon basic color='pink' labelPosition='right' fluid style={{margin: '2px', fontSize: style}} onClick={() => changeModal(!modal)} >
                    {dayMonth(i)}
                </Button>
            )
        }
        return (
            <Button icon basic color='teal' labelPosition='right' fluid style={{margin: '2px', fontSize: style}} onClick={() => changeModal(!modal)}>
                {dayMonth(i)}
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
            ///////////ITS MONTH VIEW/////////
    // return (
    //     <Grid columns={1} centered style={{marginLeft: '10px', marginRight: '10px'}}>
    //         <Grid.Row>
    //             <Grid celled>
    //                 <Grid.Row >
    //                     <Grid.Column width={4}>
    //                         <Grid style={{ justifyContent: 'space-evenly'}}>
    //                             <Grid.Column>
    //                                 <h1>{curDate.day}    {monthName()}    {curDate.year}</h1>
    //                             </Grid.Column>
    //                         </Grid>
    //                     </Grid.Column>
    //                     <Grid.Column width={8}>
    //                         <Button.Group fluid>
    //                             <Button href='/day'>День</Button>
    //                             <Button href='/week'>Неделя</Button>
    //                             <Button href='/month'>Месяц</Button>
    //                             <Button href='/year'>Год</Button>
    //                         </Button.Group>
    //                     </Grid.Column>
    //
    //                     <Grid.Column width={4}>
    //                         <Grid style={{ justifyContent: 'space-evenly'}}>
    //                             <Grid.Row>
    //                                 <Button icon='angle double left' onClick={() => setCurDate(curDate.minus({month: 1}))}/>
    //                                 <Button color='grey' onClick={() => setCurDate(DateTime.local())}>Сегодня</Button>
    //                                 <Button icon='angle double right' onClick={() => setCurDate(curDate.plus({month: 1}))}/>
    //                             </Grid.Row>
    //                         </Grid>
    //                     </Grid.Column>
    //                 </Grid.Row>
    //             </Grid>
    //         </Grid.Row>
    //         <Grid.Row>
    //             <Grid>
    //                 <Grid.Row>
    //                     <Grid.Column width={16}>
    //                         <Grid columns={7}>
    //                             <Grid.Row>
    //                                 { _.times(7, i => (
    //                                     <Grid.Column key={i} >
    //                                         <Segment color='orange' textAlign='center'>{dayWeek(i)}</Segment>
    //                                     </Grid.Column>))}
    //                             </Grid.Row>
    //                         </Grid>
    //                     </Grid.Column>
    //                 </Grid.Row>
    //                 <Grid.Row>
    //                     <Grid.Column width={16}>
    //                         <React.Fragment>
    //                             <Grid columns={7} >
    //                                 <Grid.Row style={{marginTop: '20px'}}>
    //                                     { retCalendarGrid() }
    //                                     {ModalWindow()}
    //                                 </Grid.Row>
    //                             </Grid>
    //                         </React.Fragment>
    //                     </Grid.Column>
    //                 </Grid.Row>
    //             </Grid>
    //         </Grid.Row>
    //         <Button onClick={funcAl}>OPPAAAA</Button>
    //     </Grid>
    // );

    return (
        <Grid columns={1} centered style={{marginLeft: '10px', marginRight: '10px'}}>
            <Grid.Row>
                <Grid celled>
                    <Grid.Row >
                        <Grid.Column width={4}>
                            <Grid style={{ justifyContent: 'space-evenly'}}>
                                <Grid.Column>
                                    <h1>{curDate.day}    {monthName()}    {curDate.year}</h1>
                                </Grid.Column>
                            </Grid>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Button.Group fluid>
                                <Button href='/day'>День</Button>
                                <Button href='/week'>Неделя</Button>
                                <Button href='/month'>Месяц</Button>
                                <Button href='/year'>Год</Button>
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

    function funcAl() {
        axios.post('http://127.0.0.1:3020/events/add', {title: 'test',
            description: 'test-desc',
            date_creation: '2019-12-11 21:00:00',
            date_exe: '2019-12-11 21:00:00',
            duration: 3600,
            author_id: 86,
            })
            .then(res => {console.log(res); console.log(res.data)});
        console.log('opa');
    }
};

export default App;
