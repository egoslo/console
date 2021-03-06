<template>
    <div :class="responsiveClassObject" :style="responsiveStyle">
        <table
            class="p-table"
            :class="classObject"
            :style="tableStyle"
        >
            <thead :class="theadClassObject" :style="theadStyle">
                <slot name="head" />
            </thead>
            <tbody :class="tbodyClass" :style="tbodyStyle">
                <!--            is="transition-group" name="table-row"-->
                <!--            @before-enter="beforRowEnter"-->
                <!--            @enter="rowEnter"-->
                <!--            @leave="rowLeave"-->
                <slot name="body" />
            </tbody>
            <tfoot :class="tfootClass" :style="tfootStyle">
                <slot name="foot" />
            </tfoot>
        </table>
    </div>
</template>

<script lang="ts">
import {computed, defineComponent, getCurrentInstance, reactive, Ref} from '@vue/composition-api';
import {tableProps, TablePropsType} from './toolset';

/**
 * TODO: Add custom width of each field
 */
export default defineComponent( {
    name: 'PTable',
    props: tableProps,
    setup: function (props: TablePropsType, context) {
        const getStyle = (tableStyle: object | unknown, bgStyle: object | unknown): string | null => {
            if (bgStyle && tableStyle) {
                return `bg-${tableStyle}`;
            }
            if (tableStyle) {
                return `table-${tableStyle}`;
            }
            if (bgStyle) {
                return 'table-background';
            }
            return null;
        };
        const classObject = computed(() => {
            const obj: Array<object | string> = [
                {'table-sm': props.small},
                {'table-striped': props.striped},
                {'table-hover': props.hover},
            ];
            if (props.bord !== null) {
                obj.push({
                    'table-bordered': props.bord,
                    'table-borderless': !props.bord,
                });
            }
            if (props.tableStyleType || props.background) {
                obj.push(<string>getStyle(props.tableStyleType, props.background));
            }
            return obj;
        });
        const theadClassObject:Readonly<Ref<Readonly<string[] | null>>> = computed(():string[] | null=>{
            if (props.theadStyleType){
                return [`thead-${props.theadStyleType}`];
            }
            return null
        });

        const responsiveClassObject = computed((): string | null => {
            if (props.responsive) {
                if (props.responsive === true) {
                    return 'table-responsive';
                }
                return `table-responsive-${props.responsive}`;
            }
            return null;
        });
        const beforRowEnter = (el)=> {
            el.style.opacity = 0;
            el.style.transform = 'translateY(30px)';
        };
        const rowEnter = (el, done)=> {
            const delay = el.dataset.index * 100;
            const vm:any = getCurrentInstance();
            const handler = ()=>{
                vm.$velocity(el, { translateY: '0px', opacity: 1 },
                    {
                        duration: 100,
                        complete() {
                            done();
                        },
                    });
                done();
            }
            setTimeout(handler, delay);
        };
        const rowLeave = (el, done)=> {
            el.style.opacity = 0;
            el.style.transform = 'translateY(30px)';
            done();
            // const delay = el.dataset.index * 100;
            // const vm = this;
            // setTimeout(() => {
            //     vm.$velocity(el, { translateY: '30px', opacity: 0 },
            //         {
            //             duration: 100,
            //             complete() {
            //                 done();
            //             },
            //         });
            //     done();
            // }, delay);
        };
        return {
            classObject,
            theadClassObject,
            responsiveClassObject,
            beforRowEnter,
            rowEnter,
            rowLeave,
        };
    },
});
</script>

<style lang="postcss">
    .table-background {
        @apply bg-white;
    }
    .p-table{
        @apply w-full max-w-full mb-4;
        background: transparent;
        border-collapse: separate;
        border-spacing: 0;
        thead{
            tr{
                th{
                    @apply bg-white border-t border-dark border-b text-gray1;
                    position: sticky;
                    z-index: 1;
                    top: 0;
                    padding: .25rem 0 .25rem .75rem;
                    line-height: 1.5rem;
                    text-align: left;
                    letter-spacing: 0;
                }
            }
        }
        &.table-hover{
            tbody tr:hover {
                @apply bg-secondary2;
            }
        }
        tbody{
            tr{
                @apply bg-white;
                td{
                    height: 2.5rem;
                    padding: 0 .75rem;
                    z-index: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    vertical-align: middle;
                }
                &:first-child{
                    td{
                        border-top: 0;
                    }
                }
            }
        }
    }

    .table-striped tbody tr:nth-of-type(odd) {
        background-color: transparent;
    }
    .table-striped tbody tr:nth-of-type(even) {
        @apply bg-primary4;
        &:hover {
            @apply bg-secondary2;
        }
    }

</style>
