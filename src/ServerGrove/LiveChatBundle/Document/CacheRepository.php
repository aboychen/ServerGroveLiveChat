<?php

namespace ServerGrove\SGLiveChatBundle\Document;

/**
 * Description of CacheRepository
 *
 */
class CacheRepository extends \Doctrine\ODM\MongoDB\DocumentRepository
{
    public function getByKey($key)
    {
       return $this->findOneBy(array('key' => $key));
    }
}