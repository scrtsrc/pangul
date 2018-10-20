import * as React from "react";
import {Answer} from "../../../../../react-pangul-core/src/domain/answer";
import {Question} from "../../../../../react-pangul-core/src/domain/question";
import {Topic} from "../../../../../react-pangul-core/src/domain/topic";
import {SafeMarkdown} from "../../common/display/safeMarkdown/safeMarkdown";
import {LayoutRightBox} from "../../layout/layoutRightBox/layoutRightBox";
import {VotesAndStars} from "../../metadata/votesAndStars/votesAndStars";
import {AnswerLink, AnswerLinkType} from "../answerLink/answerLink";
import "./answerView.css";

export interface IAnswerView {
    answer: Answer;
    question: Question;
    topic: Topic;
}

export class AnswerView extends React.Component<IAnswerView> {
    public render() {
        const meta = this.props.answer.state.meta;

        return (
            <div className="component--AnswerView">
                <LayoutRightBox expand={false}>
                    <AnswerLink question={this.props.question} answer={this.props.answer} target={AnswerLinkType.Edit}>
                        Edit
                    </AnswerLink>
                </LayoutRightBox>
                <div className="metadata">
                    <VotesAndStars showStars={false}
                                   userStars={0}
                                   userVotes={meta.state.votes}
                                   votes={meta.state.global.votes}
                                   onVote={this.onVote}
                                   onStar={null}/>
                </div>
                <div className="output">
                    <SafeMarkdown markdown={this.props.answer.state.body}/>
                </div>
            </div>
        );
    }

    private onVote = async (votes: number) => {
        if (votes > 0) {
            await this.props.answer.state.meta.voteUp();
        } else if (votes < 0) {
            await this.props.answer.state.meta.voteDown();
        } else {
            await this.props.answer.state.meta.voteNeutral();
        }
    }
}
