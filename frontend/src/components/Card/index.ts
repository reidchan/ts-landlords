import { Component, Vue, Prop } from 'vue-property-decorator';
import { PokerCard } from 'landlord-core';

@Component
export default class Card extends Vue {
  @Prop(Object) private readonly card: PokerCard | undefined;
}
