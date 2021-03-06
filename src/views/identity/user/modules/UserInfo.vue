<template>
    <div>
        <BasePanel :panels="panelData"
                   @edit="showTagEditModal"
        />
        <BaseModal ref="IDUS003_TagEditModal"
                   :title="$t('TITLE', [$t('BTN_EDIT'), $t('TAG')])"
                   :centered="true"
                   size="md"
                   type="primary"
                   :interactive="true"
                   @ok="onEditTags"
                   @cancel="hideTagEditModal"
        >
            <template #contents>
                <BaseTag ref="IDUS003_Tags"
                         :tag-data="tags"
                         :editable="true"
                         align="between"
                />
            </template>
        </BaseModal>
    </div>
</template>

<script>
const BasePanel = () => import('@/components/base/panel/BasePanel');
const BaseModal = () => import('@/components/base/modal/BaseModal');
const BaseTag = () => import('@/components/base/tags/BaseTag');
const userModel = {
    user_id: null,
    name: null,
    password: null,
    email: null,
    mobile: null,
    group: null,
    domain_id: null,
    language: null,
    timezone: null,
    tags: [],
};

export default {
    name: 'UserInfo',
    components: {
        BasePanel,
        BaseModal,
        BaseTag,
    },
    props: {
        userData: {
            type: Object,
            default: () => (userModel),
            required: true,
        },
    },
    computed: {
        user() {
            return [
                { title: this.$t('COL_NM.ID'), contents: this.userData.user_id, copyFlag: true },
                { title: this.$t('COL_NM.NAME'), contents: this.userData.name, copyFlag: true },
                { title: this.$t('COL_NM.EMAIL'), contents: this.userData.email, copyFlag: true },
                { title: this.$t('COL_NM.PHONE'), contents: this.userData.mobile, copyFlag: true },
                { title: this.$t('COL_NM.GROUP'), contents: this.userData.group, copyFlag: true },
                {
                    title: this.$t('COL_NM.STATE'), state: this.userData.state, stateType: 'MEMBER_STATE', copyFlag: true,
                },
                { title: this.$t('COL_NM.LANGUAGE'), contents: this.userData.language, copyFlag: true },
                { title: this.$t('COL_NM.DOMAIN_ID'), contents: this.userData.domain_id, copyFlag: true },
                { title: this.$t('COL_NM.TIMEZONE'), contents: this.userData.timezone, copyFlag: true },
            ];
        },
        tag() {
            const tag = [];
            for (const key in this.userData.tags) {
                tag.push({
                    title: key,
                    contents: this.userData.tags[key],
                    copyFlag: true,
                });
            }
            return tag;
        },
        tags() {
            return this.dictToKeyValueArray(this.userData.tags);
        },
        panelData() {
            return [
                {
                    panelTitle: this.$t('PANEL.BASE_INFO'),
                    panelIcon: {
                        icon: 'fa-hashtag', type: 'l', size: 1, color: 'primary',
                    },
                    data: this.user,
                },
                {
                    panelTitle: this.$t('PANEL.TAG'),
                    panelIcon: {
                        icon: 'fa-tags', type: 'l', size: 1, color: 'danger',
                    },
                    data: this.tag,
                    editable: true,
                },
            ];
        },
    },
    methods: {
        async onEditTags() {
            if (this.$refs.IDUS003_Tags.validate()) {
                let res = null;
                try {
                    res = await this.$http.post('/identity/user/update', {
                        user_id: this.userData.user_id,
                        tags: this.$refs.IDUS003_Tags.tags,
                    });
                    this.hideTagEditModal();
                    this.$emit('update', res.data);
                } catch (e) {
                    console.error(e);
                }
            }
        },
        showTagEditModal() {
            this.$refs.IDUS003_TagEditModal.showModal();
        },
        hideTagEditModal() {
            this.$refs.IDUS003_TagEditModal.hideModal();
        },
    },
};
</script>

<style lang="postcss" scoped>

</style>
