/*
import * as React from "react";
import { Topic } from "../../../../../react-pangul-core/src/domain/topic";
import { LoggerProvider } from "../../../../../react-pangul-core/src/providers/loggerProvider";
import { PageLoader } from "../../../componentHelpers/common/loaders/pageLoader";
import { TopicInfo } from "../../../componentHelpers/topic/topicInfo";
import { ITopicHomeProps, ITopicHomeState, TopicDiscover } from "./topicHome";

export class TopicDiscoverPage extends React.Component<ITopicHomeProps, ITopicHomeState> {
    private data: TopicDiscover | null = null;

    constructor(props: ITopicHomeProps) {
        super(props);
        this.state = {
            error: null,
            loading: true,
            topic: new Topic(),
        };
    }

    public componentDidMount() {
        LoggerProvider.get().info("Did mount");
        this.data = new TopicDiscover((delta, cb) => this.setState(delta, cb));
        this.data.load(this.props);
    }

    public componentWillUnmount() {
        if (this.data != null) {
            this.data.unload();
        }
        this.data = null;
    }

    public render() {
        if (!this.guardInvalidState()) {
            return "";
        }
        LoggerProvider.get().info("Render state", this.state);
        return (
            <div className={"component--TopicDiscoverPage"}>
                <PageLoader loading={this.state.loading}/>
                <div>
                    error: {this.state.error ? this.state.error.toString() : "no"}
                </div>
                <TopicInfo {...(this.state.topic || {state: {}}).state} />
            </div>
        );
    }

    public guardInvalidState(): boolean {
        if (this.data === null) {
            return false;
        }
        return true;
    }
}
*/
