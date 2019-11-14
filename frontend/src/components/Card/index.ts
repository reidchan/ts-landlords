import { Component, Vue, Prop } from 'vue-property-decorator';
import PokerCard from '@/core/PokerCard';

@Component
export default class Card extends Vue {
  @Prop(Object) private readonly card: PokerCard | undefined;

  public created() {
    console.log('card =>', this.card);
  }

}
