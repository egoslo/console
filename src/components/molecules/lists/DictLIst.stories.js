import { withKnobs, object } from '@storybook/addon-knobs/vue';
import PDictList from './DictList.vue';


export default {
    title: 'molecules/DictList',
    component: PDictList,
    decorators: [withKnobs],
};


export const defaultCase = () => ({
    components: { PDictList },
    props: {
        dict: {
            default: object('tags', {
                key1: 'value1',
                key2: 'value2',
                key3: 'value3',
            }),
        },
    },
    template: '<p-dict-list v-bind="$props"/>',
});
