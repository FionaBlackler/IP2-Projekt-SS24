const   UserView =() => {
    return(
        <div>

            <QuestionList/>





        </div>
    )
}
import './UserView.css'
import { Header } from 'antd/es/layout/layout.js'
import { Route } from 'react-router-dom'
import { useState } from 'react'
import { Container } from 'react-bootstrap'
import { Card } from 'antd'

const UserView = () => {
    const [selections, setSelections] = useState({})

    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState({})

    return <Container>
        <Header />
        <Route exact path={`/survey/:surveyId`}>
            <Card>
                <BackLink onClick={() => history.goBack()}>Back to surveys</BackLink>
                <Head>
                    <Question>Take a quick survey</Question>
                    <SizedBox height="20px"></SizedBox>
                    <VectorContainer src={bermuda_welcome} />
                    <SizedBox height="20px"></SizedBox>
                    <div>
                        {questions?.length} QUESTION{questions?.length !== 1 ? 'S' : ''}
                    </div>
                    <div>
                        {' '}
                        {0.25 * questions?.length} MINUTE
                        {questions?.length !== 4 ? 'S' : ''}
                    </div>
                </Head>
                <p className="center">
                    {!isLoading && data.taken && 'You already completed this survey'}
                </p>
                {!isLoading && (
                    <Buttons>
                        {data.taken ? (
                            <Button
                                large
                                block
                                color="secondary"
                                textColor={themes.colors.textNormal}
                                leftIcon="chevron_left"
                                onClick={() => history.goBack()}
                            >
                                Go back
                            </Button>
                        ) : (
                            <Button
                                large
                                block
                                color="secondary"
                                textColor={themes.colors.textNormal}
                                rightIcon="chevron_right"
                                onClick={() =>
                                    history.push(
                                        `/survey/${match.params.surveyId}/questions/${questions[0].id}`
                                    )
                                }
                            >
                                Start Now
                            </Button>
                        )}
                    </Buttons>
                )}
            </Card>
        </Route>

        {questions?.map((question, i) => {
            return (
                <Route
                    key={question.id}
                    exact
                    path={`${getUrlWithoutLastPart(match.path)}/${question.id}`}
                >
                    <Card>
                        <BackLink onClick={() => history.goBack()}>
                            {i > 0 ? 'Previous Question' : 'Go back'}
                        </BackLink>
                        <Question>{question.title}</Question>
                        <SizedBox height="20px" />
                        {question.options.map(text => (
                            <AnswerItem
                                key={text}
                                questionId={question.id}
                                answerId={text}
                                text={text}
                                selected={selections[question.id] === text}
                                selections={selections}
                                onSelect={setSelections}
                            ></AnswerItem>
                        ))}
                        <Buttons>
                            <Button
                                large
                                block
                                disabled={!selections[getQuestionId(match.url)]}
                                color="secondary"
                                textColor={themes.colors.textNormal}
                                rightIcon="chevron_right"
                                onClick={goToNextPage}
                            >
                                Next
                            </Button>
                        </Buttons>
                    </Card>
                </Route>
            )
        })}

        <Route exact path={`/survey/:surveyId/complete`}>
            <Card center>
                <BackLink onClick={() => history.goBack()}>Go back</BackLink>

                <Head>
                    <Question>Survey Completed</Question>
                    <SizedBox height="20px"></SizedBox>
                    <VectorContainer src={done_vector} />
                    <SizedBox height="20px"></SizedBox>
                </Head>
                <Buttons>
                    <Button
                        large
                        color="danger"
                        leftIcon="cancel"
                        onClick={() => history.push(URL_SURVEYS)}
                    >
                        Cancel
                    </Button>
                    <SizedBox width="40px" />
                    <Button
                        large
                        color="secondary"
                        textColor={themes.colors.textNormal}
                        leftIcon="check_circle"
                        onClick={submitSurvey}
                    >
                        Submit
                    </Button>
                </Buttons>
            </Card>
        </Route>
    </Container>
)

}

export default UserView
