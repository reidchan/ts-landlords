import { Context, controller, post, provide } from 'midway'

@provide()
@controller('/room')
export class RoomController {

  @post('/')
  public create(ctx: Context): void {
    ctx.body = '奥利给'
  }

}

