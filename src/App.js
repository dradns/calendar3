import React, { useState } from 'react';
import {DateTime, Duration, Info, Interval, Settings} from 'luxon';
import _ from 'lodash';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Grid, Button, Segment, Icon} from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';

const App = () => {

    const [curDate, setCurDate] = useState(DateTime.local());

    function monthName() {
        let mas = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль',
            'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        return mas[curDate.month - 1];
    }

    function dayMonth(i) {
        let mas = [];
        for( let j = 1; j <= curDate.daysInMonth; j++){
            mas.push(j);
        }
        return mas[i];
    }

    function createEvent(){
        alert('create event function ' + curDate.year);
    }

    function firstMonthDay(){
        let zz = curDate;//текущая дата
        let ss = zz.daysInMonth;//ко-во дней в данном месяце
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
                        <Button icon basic color='white'  content='' fluid style={{marginTop: '10px' , visibility : 'hidden' }}/>
                    </Grid.Column>
                ))}
                {_.times(curDate.daysInMonth, i => (
                    <Grid.Column key={i} >
                        <Button icon basic color='teal' labelPosition='right' fluid style={{marginTop: '10px'}} onClick={createEvent}>
                            <Icon name='plus' />
                            {dayMonth(i)}
                        </Button>
                    </Grid.Column>

                ))}
            </React.Fragment>
        )
    }

    return (
        <Grid columns={1} centered style={{margin: '10px'}}>
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
                                    <Button color='grey' content='today' onClick={() => setCurDate(DateTime.local())}>{}</Button>
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
                                        </Grid.Column>))
                                    }
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
