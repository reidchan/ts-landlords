import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Hall extends Vue {

  public created() {
    console.log(this.$store.state.user.token);
  }

}
