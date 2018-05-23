<?php
/**
 * UserFrosting (http://www.userfrosting.com)
 *
 * @link      https://github.com/userfrosting/UserFrosting
 * @license   https://github.com/userfrosting/UserFrosting/blob/master/licenses/UserFrosting.md (MIT License)
 */

namespace UserFrosting\Sprinkle\Core\Model;

use UserFrosting\Sprinkle\Core\Database\Models\Model;
use UserFrosting\Sprinkle\Core\Facades\Debug;

/**
 * UFModel Class
 *
 * @deprecated since 4.1
 * @author Alex Weissman (https://alexanderweissman.com)
 */
abstract class UFModel extends Model
{
    public function __construct(array $attributes = []) {
        Debug::debug("UFModel has been deprecated and will be removed in future versions.  Please move your model " . static::class . " to Database/Models/ and have it extend the base Database/Models/Model class.");

        parent::__construct($attributes);
    }
}
