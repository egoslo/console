import { action } from '@storybook/addon-actions';
import { toRefs, computed } from '@vue/composition-api';
import PStatus from '@/components/molecules/status/Status.vue';
import PToolboxTable from '@/components/organisms/tables/toolbox-table/ToolboxTable.vue';
import PButton from '@/components/atoms/buttons/Button.vue';
import PBadge from '@/components/atoms/badges/Badge.vue';
import Server, { serverSetup, eventNames } from '@/views/inventory/server/Server.template.vue';
import { arrayOf } from '@/lib/casual';
import casual from '@/views/inventory/server/models/server-model';
import { mountBusEvent } from '@/lib/compostion-util';
import ServerEventBus from '@/views/inventory/server/ServerEventBus';

export default {
    title: 'views/inventory/server',
    component: Server,
    parameters: {
        info: {
            summary: '',
            components: { Server },
        },
    },
};
const actions = {
    rowLeftClick: action('rowLeftClick'),
    rowRightClick: action('rowRightClick'),
    rowMiddleClick: action('rowMiddleClick'),
    rowMouseOver: action('rowMouseOver'),
    rowMouseOut: action('rowMouseOut'),
    clickRefresh() {
        return action('clickRefresh');
    },
};


export const mockPage = () => ({
    template: `${Server.template}`,
    components: {
        PStatus,
        PToolboxTable,
        PButton,
        PBadge,
    },
    mixins: [Server],
    setup(props, context) {
        const serverEventNames = eventNames;
        serverEventNames.getServerList = 'getServerData';
        serverEventNames.tagConfirmEvent = 'ServerTagConfirmEvent';
        serverEventNames.tagResetEvent = 'resetTagEvent';
        serverEventNames.getServerSubData = 'getSubData';
        const state = serverSetup(props, context, serverEventNames);
        console.debug(state);
        const items = computed(() => arrayOf(state.pageSize, casual._server));
        const getSubDate = (server_id, name) => {
            const mock = {
                disk: casual._disk,
                nic: casual._nic,
                security_group: casual._security_group_rule,
            };
            state.subData.items = arrayOf(state.subData.pageSize, mock[name]);
        };
        mountBusEvent(ServerEventBus, serverEventNames.getServerSubData, getSubDate);
        return {
            ...toRefs(state),
            items,
        };
    },
});
