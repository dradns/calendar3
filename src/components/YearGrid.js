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

const YearGrid = () => {
    const [curDate, setCurDate] = useState(DateTime.local());

    function monthName() {
        let mas = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль',
            'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        return mas[curDate.month - 1];
    }

    function retMonth(i) {

        return (<Grid.Row>
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
        </Grid.Row>)
    }

    return(
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
                    <Grid.Row>
                        {_.times(4, i =>(
                            <Grid.Column>
                                {retMonth()}
                            </Grid.Column>
                        ))}
                    </Grid.Row>
                ))}

            </Grid>
        </Grid>
    )
};

export default YearGrid;