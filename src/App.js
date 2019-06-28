import React, { useState } from 'react';
import {DateTime, Duration, Info, Interval, Settings} from 'luxon';
import _ from 'lodash';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Grid, Button, Segment, Icon, Modal, Header, Form} from "semantic-ui-react";
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import 'semantic-ui-css/semantic.min.css';

const App = () => {
    const DATA = DateTime.local();
    const [curDate, setCurDate] = useState(DateTime.local());
    const [modal, changeModal] = useState(true);
    const [event, setEvent] = useState({
        title: '',
        place: '',
        description: '',
        date_exe: '',
        user_id: '',
        hour: 0,
        minutes: 0,
        duration: 0
    });

    function Datepicker() {
        function onDateChange(e) {
        }
        return (<SemanticDatepicker onDateChange={onDateChange} />)
    }
    
    function onSubmit(e) {
        e.preventDefault();
        setEvent({ title: event.target.title, place: event.target.place,  date_exe: event.target.date_exe});
    }

    function ModalExampleCloseIcon(){
        return (
            <Modal open={modal} size='big'>
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
                    {<ModalExampleCloseIcon value={i+31} onClick={console.log(i + 1)}/>}
                    {checkCurDay(i)}
                </Grid.Column>
            ))
        )
    }

    function checkCurDay(i) {
        if ((i === curDate.day - 1) && (curDate.year === DATA.year) && (curDate.month === DATA.month)){
            return (
                <Button icon primary labelPosition='right' fluid style={{marginTop: '10px', fontWeight: 'bold' }} onClick={() => changeModal(!modal)}>
                    <Icon name='plus' />
                    {dayMonth(i)}
                </Button>
            )
        }
        return (
            <Button icon basic color='teal' labelPosition='right' fluid style={{marginTop: '10px'}} onClick={() => changeModal(!modal)}>
                <Icon name='plus' />
                {dayMonth(i)}
            </Button>
        )
    }

    function monthName() {
        let mas = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль',
            'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        return mas[curDate.month - 1];
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

    function dayWeek(i) {
        let mas = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'];
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

    return (
        <Grid columns={1} centered style={{marginLeft: '10px', marginRight: '10px'}}>
            <Grid.Row>
                <Grid celled>
                    <Grid.Row >
                        <Grid.Column width={4}>
                            <Grid style={{ justifyContent: 'space-evenly'}}>
                                <Grid.Column>
                                    <h1>{curDate.day}</h1>
                                </Grid.Column>
                                <Grid.Column>
                                    <h1>{monthName()}</h1>
                                </Grid.Column>
                                <Grid.Column>
                                    <h1>{curDate.year}</h1>
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
                                    </Grid.Row>
                                </Grid>
                            </React.Fragment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Grid.Row>
        </Grid>
    )
};

export default App;
