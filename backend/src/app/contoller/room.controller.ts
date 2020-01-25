import { Context, controller, post, provide } from 'midway';

@provide()
@controller('/room')
export class RoomController {

  @post('/:id')
  public create(ctx: Context): void {
    console.log('ctx', ctx.params.id);
    ctx.body = '奥利给';
  }

}

