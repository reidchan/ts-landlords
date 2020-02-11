import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Hall extends Vue {

  public async created() {
    console.log(await this.$http.get('/home'));
  }

}
