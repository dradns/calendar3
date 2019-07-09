import React, { useState, useEffect} from 'react';
import {DateTime, Duration, Info, Interval, Settings} from 'luxon';
import _ from 'lodash';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Grid, Button, Segment, Icon, Modal, Header, Form, Item, Divider, Container, Card, Image} from "semantic-ui-react";
import axios from 'axios';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import 'semantic-ui-css/semantic.min.css';
import GridColumn from "semantic-ui-react/dist/commonjs/collections/Grid/GridColumn";

const App = () => {
    // console.log('render');
    let mas2 = [];
    let counter = 1;
    const DATA = DateTime.local();
    const [curDate, setCurDate] = useState(DateTime.local());
    const [modal, changeModal] = useState(false);
    const [event, setEvent] = useState({ events: [] });
    const [month, setMonth] = useState({eventsMonth: []});
    const [eventsYear, setEventsYear] = useState({eventsYear: []});///////////
    const [view, setView] = useState(1);//////////////////////////////////////


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
                    mas3.push({id: response.data[i].id, title: response.data[i].title,
                    description: response.data[i].description, date_creation: response.data[i].date_creation,
                    duration: response.data[i].duration, author_id: parseInt(response.data[i].author_id),
                    date_exe_year: parseInt(response.data[i].date_exe.split('-')[0]),
                    date_exe_month: parseInt(response.data[i].date_exe.split('-')[1]),
                    date_exe_day: parseInt(response.data[i].date_exe.split('-')[2]),
                    date_exe_hour: parseInt(response.data[i].date_exe.split('T')[1].split(':')[0]),
                    date_exe_hour_str: response.data[i].date_exe.split('T')[1].split(':')[0],
                    date_exe_minute: parseInt(response.data[i].date_exe.split('T')[1].split(':')[1]),
                    date_exe_minute_str: response.data[i].date_exe.split('T')[1].split(':')[1],
                    date_exe_second: parseInt(response.data[i].date_exe.split('T')[1].split(':')[2])
                    });
                    // console.log(response.data[i]);
                }
            }
            setMonth(mas2);
            setEventsYear(mas3);
        }
        fetchMonth();
    }, [curDate]);


    function Datepicker() {
        function onDateChange(e) {
        }
        return (<SemanticDatepicker onDateChange={onDateChange} />)
    }

    function onSubmit(e) {
        e.preventDefault();
        setEvent({ title: e.target.title, place: e.target.place,  date_exe: e.target.date_exe});
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

    function isWeekends(i){
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

    function fillEventsForDay(todayEvents, i) {
        // console.log(todayEvents);
        for (let k = 0; k < todayEvents.length; k++){
            console.log(i + ' its I');
            console.log(todayEvents[k].date_exe_hour + ' its HOUR');
            if (i === todayEvents[k].date_exe_hour){
                return (
                    <Card>
                        <Card.Content>
                            <Card.Header style={{textAlign: 'center'}}>{todayEvents[k].title}</Card.Header>
                            <Card.Meta>Время начала: {todayEvents[k].date_exe_hour_str}:{todayEvents[0].date_exe_minute_str}</Card.Meta>
                            <Card.Meta>Продолжительность: {todayEvents[k].duration /60} минут</Card.Meta>
                            <Card.Description>{todayEvents[k].description} ----------------its a description</Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <div className='ui two buttons'>
                                <Button basic color='red'>
                                    Отменить
                                </Button>
                            </div>
                        </Card.Content>
                    </Card>);
            }
        }
    }

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
                                            {/*{ModalWindow()}*/}
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

    function retViewWeek() {
        return (
            <React.Fragment>
                <h1>Week View</h1>
                <Segment style={{fontSize: '36px'}}>ITS WEEK VIEW</Segment>
            </React.Fragment>)
    }

    // function retViewDay() {
    //     return (
    //         <Grid columns={1} centered style={{marginLeft: '10px', marginRight: '10px'}}>
    //             <Grid.Row>
    //                 <Grid celled>
    //                     <Grid.Row >
    //                         <Grid.Column width={4}>
    //                             <Grid style={{ justifyContent: 'space-evenly'}}>
    //                                 <Grid.Column>
    //                                     <h1>{curDate.day}    {monthName()}    {curDate.year}</h1>
    //                                 </Grid.Column>
    //                             </Grid>
    //                         </Grid.Column>
    //                         <Grid.Column width={8}>
    //                             <Button.Group fluid>
    //                                 <Button onClick={() => setView(1)}>День</Button>
    //                                 <Button onClick={() => setView(2)}>Неделя</Button>
    //                                 <Button onClick={() => setView(0)}>Месяц</Button>
    //                                 <Button onClick={() => setView(3)}>Год</Button>
    //                             </Button.Group>
    //                         </Grid.Column>
    //
    //                         <Grid.Column width={4}>
    //                             <Grid style={{ justifyContent: 'space-evenly'}}>
    //                                 <Grid.Row>
    //                                     <Button icon='angle double left' onClick={() => setCurDate(curDate.minus({day: 1}))}/>
    //                                     <Button color='grey' onClick={() => setCurDate(DateTime.local())}>Сегодня</Button>
    //                                     <Button icon='angle double right' onClick={() => setCurDate(curDate.plus({day: 1}))}/>
    //                                 </Grid.Row>
    //                             </Grid>
    //                         </Grid.Column>
    //                     </Grid.Row>
    //                 </Grid>
    //             </Grid.Row>
    //
    //             <Grid columns={1}>
    //                 <Grid.Row >
    //                     <Grid.Column>
    //                         <Segment color='orange' textAlign='center' style={{fontSize: '30px', marginBottom: '10px'}}>{dayWeek(curDate.weekday - 1)}</Segment>
    //                         <Item.Group  relaxed='very'>
    //                                 {_.times(24, i => (
    //                                     <Item key={i}>
    //                                         <Item.Content content={hourInDayForDay(i)} verticalAlign='middle'/>
    //                                         <Item.Content verticalAlign='middle'>Событие</Item.Content>
    //                                         <Button icon='plus' basic color='teal'></Button>
    //                                     </Item>
    //                                 ))}
    //                         </Item.Group>
    //                     </Grid.Column>
    //                 </Grid.Row>
    //             </Grid>
    //         </Grid>
    //     );
    // }

    function retViewDay() {
        let todayEvents =  isEventForDay();
        // console.log(todayEvents[0]);
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
                                                {/*<Grid.Row style={{backgroundColor: 'pink'}}>*/}
                                                {/*    <Segment></Segment>*/}
                                                {/*</Grid.Row>*/}
                                                {/*<Grid.Row>*/}
                                                {/*    <Segment></Segment>*/}
                                                {/*</Grid.Row>*/}
                                                {/*<Grid.Row>*/}
                                                {/*    <Segment></Segment>*/}
                                                {/*</Grid.Row>*/}
                                                {/*<Grid.Row>*/}
                                                {/*    <Segment></Segment>*/}
                                                {/*</Grid.Row>*/}
                                                {fillEventsForDay(todayEvents, i)}
                                            </Grid.Column>

                                            <Grid.Column width={1} style={{textAlign: 'right'}} verticalAlign='middle'>
                                                <Button icon='plus' basic color='teal' onClick={() => alert(i + 1)}></Button>
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

    // function retViewDay() {
    //     return (
    //         <Grid columns={1} centered style={{marginLeft: '10px', marginRight: '10px'}}>
    //             <Grid.Row>
    //                 <Grid celled>
    //                     <Grid.Row >
    //                         <Grid.Column width={4}>
    //                             <Grid style={{ justifyContent: 'space-evenly'}}>
    //                                 <Grid.Column>
    //                                     <h1>{curDate.day}    {monthName()}    {curDate.year}</h1>
    //                                 </Grid.Column>
    //                             </Grid>
    //                         </Grid.Column>
    //                         <Grid.Column width={8}>
    //                             <Button.Group fluid>
    //                                 <Button onClick={() => setView(1)}>День</Button>
    //                                 <Button onClick={() => setView(2)}>Неделя</Button>
    //                                 <Button onClick={() => setView(0)}>Месяц</Button>
    //                                 <Button onClick={() => setView(3)}>Год</Button>
    //                             </Button.Group>
    //                         </Grid.Column>
    //
    //                         <Grid.Column width={4}>
    //                             <Grid style={{ justifyContent: 'space-evenly'}}>
    //                                 <Grid.Row>
    //                                     <Button icon='angle double left' onClick={() => setCurDate(curDate.minus({day: 1}))}/>
    //                                     <Button color='grey' onClick={() => setCurDate(DateTime.local())}>Сегодня</Button>
    //                                     <Button icon='angle double right' onClick={() => setCurDate(curDate.plus({day: 1}))}/>
    //                                 </Grid.Row>
    //                             </Grid>
    //                         </Grid.Column>
    //                     </Grid.Row>
    //                 </Grid>
    //             </Grid.Row>
    //
    //             <Grid centered columns={1}>
    //                 <Segment color='orange' textAlign='center' style={{fontSize: '30px', marginBottom: '10px'}}>{dayWeek(curDate.weekday - 1)}</Segment>
    //                         {_.times(24, i => (
    //
    //                             <Grid.Row key={i}>
    //                                 <Grid.Column width={3}>
    //
    //                                     <Item>
    //                                         <Item.Content content={hourInDayForDay(i)} verticalAlign='middle' style={{textAlign: 'center'}}/>
    //                                     </Item>
    //
    //                                 </Grid.Column>
    //
    //                                 <Grid.Column width={10}>
    //                                     <Item.Group divided relaxed='very'>
    //                                         {_.times(4, i => (
    //                                             <Item.Content key={i} verticalAlign='middle'  style={{textAlign: 'center'}}>СобытиеСобытиеСобытиеСобытиеСобытиеСобытиеСобытиеСобытиеСобытиеСобытиеСобытиеСобытиеС</Item.Content>
    //                                         ))}
    //                                     </Item.Group>
    //                                 </Grid.Column>
    //
    //                                 <Grid.Column width={3} style={{textAlign: 'center'}}>
    //                                     <Item>
    //                                         <Button icon='plus' basic color='teal'></Button>
    //                                     </Item>
    //                                 </Grid.Column>
    //                             </Grid.Row>
    //
    //                         ))}
    //             </Grid>
    //         </Grid>
    //     );
    // }

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

    /////////////////////////////////////////////////////
    function selectorView() {////////////////////////////
        if (view === 0){/////////////////////////////////
            return retViewMonth();//////////выбор View///
        }else if (view === 1){///////////////////////////
            return retViewDay();//////////выбор View/////
        }else if (view === 2){///////////////////////////
            return retViewWeek();//////////выбор View////
        }else if (view === 3){///////////////////////////
            return retViewYear();//////////выбор View////
        }////////////////////////////////////////////////
    }////////////////////////////////////////////////////

    return (selectorView());/// это вызывается при рендере APP
};

export default App;
